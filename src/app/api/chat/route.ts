import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob | null;
    
    let userText = "";
    if (audioFile) {
      // Validate audio file size (max 10MB)
      if (audioFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Audio recording must be smaller than 10 MB.' }, { status: 400 });
      }
    } else {
      const text = formData.get('text');
      if (text) {
        // Bound text length to prevent memory exhaustion and token flooding
        userText = String(text).slice(0, 2000).trim();
      } else {
        return NextResponse.json({ error: 'No audio or text provided' }, { status: 400 });
      }
    }

    const sarvamApiKey = process.env.SARVAM_API_KEY;
    const merchantId = process.env.MERCHANT_ID || 'PTM88291048';
    
    // Default to the user's selected language from settings for text queries
    let reqLanguage = (formData.get('language') as string) || 'hi-IN';

    // 1. STT (Speech to Text) via Sarvam if audio is provided
    if (audioFile && sarvamApiKey) {
      try {
        const sttFormData = new FormData();
        sttFormData.append('file', audioFile, 'audio.webm');
        sttFormData.append('model', 'saaras:v3');
        sttFormData.append('language_code', 'unknown'); // Auto-detect language

        const sttResponse = await fetch('https://api.sarvam.ai/speech-to-text', {
          method: 'POST',
          headers: { 'api-subscription-key': sarvamApiKey },
          body: sttFormData,
        });

        if (sttResponse.ok) {
          const sttData = await sttResponse.json();
          userText = (sttData.transcript || userText).slice(0, 2000);
          if (sttData.language_code) {
            reqLanguage = sttData.language_code; // Override with auto-detected language
          }
        } else {
          console.error('[Sarvam STT Error]:', await sttResponse.text());
        }
      } catch (sttErr) {
        console.error('[Sarvam STT Network Error]:', sttErr);
      }
    }

    // 1.5 Wake word check
    const isWakeWordMode = formData.get('wakeWordCheck') === 'true';
    if (isWakeWordMode && userText) {
      const lowerText = userText.toLowerCase();
      const hasWakeWord = lowerText.includes('saarthi') ||
                          lowerText.includes('sarthi') ||
                          lowerText.includes('सारथी') ||
                          lowerText.includes('sharthi') ||
                          lowerText.includes('sarti') ||
                          lowerText.includes('sarathi') ||
                          lowerText.includes('sarathy');
      if (!hasWakeWord) {
        return NextResponse.json({ wakeWordMiss: true, userText }, { status: 200 });
      }
    }

    // Map language codes to names for the LLM prompt
    const languageNames: Record<string, string> = {
      'en-IN': 'English',
      'hi-IN': 'Hindi',
      'bn-IN': 'Bengali',
      'ta-IN': 'Tamil',
      'te-IN': 'Telugu',
      'kn-IN': 'Kannada',
      'ml-IN': 'Malayalam',
      'mr-IN': 'Marathi',
      'gu-IN': 'Gujarati',
      'pa-IN': 'Punjabi',
      'od-IN': 'Odia'
    };
    const targetLanguageName = languageNames[reqLanguage] || 'Hindi';

    // 2. Memory Layer & LLM Generation
    const cogneeApiUrl = process.env.COGNEE_BASE_URL;
    const cogneeApiKey = process.env.COGNEE_API_KEY;
    const sessionId = "session_saarthi_" + new Date().toISOString().split('T')[0];

    let aiText = "मुझे समझ नहीं आया।"; // Fallback in clean UTF-8 Hindi
    let aiAction: any = null;

    if (cogneeApiUrl && cogneeApiKey) {
      try {
        const businessIntelligence = `
          Current Business Status (Merchant ${merchantId}):
          - Daily Transactions: ₹8,450 (Up 12.5% from yesterday)
          - Profit Margin: 22% overall
          - Ledger/Udhaar Balances: ₹2,100 pending from 3 high-risk accounts (Ramesh, Suresh, Mahesh).
          - Staffing Updates: Cashier Rahul is on leave today. Amit is covering the morning shift.
          - Operational Alerts: Fasting essentials (Sabudana) demand surging by 55% for Navratri.
        `;

        const enrichedQuery = `System: You are Saarthi, a voice-interactive financial AI. Reply in concise conversational ${targetLanguageName} ONLY (maximum 3 short sentences, strictly under 400 characters). Do not use English script if the language is regional.
If the user wants to log, add, or record a transaction/ledger entry (e.g. Udhaar, Jama, payment received, credit), include this exact string format AT THE VERY END of your response: ||ACTION_LEDGER:{"name":"<customer_name>", "amount":<amount_as_number>, "type":"<received|pending>"}||

Business Context: ${businessIntelligence}
User Question: ${userText}`;

        const cogneeResponse = await fetch(`${cogneeApiUrl}/api/v1/recall`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': cogneeApiKey,
          },
          body: JSON.stringify({
            query: enrichedQuery,
            session_id: sessionId,
            search_type: "HYBRID_COMPLETION"
          }),
        });

        if (cogneeResponse.ok) {
          const cogneeData = await cogneeResponse.json();
          if (Array.isArray(cogneeData) && cogneeData.length > 0) {
            aiText = cogneeData[0].text || cogneeData[0].answer || aiText;
          } else {
            aiText = cogneeData.answer || cogneeData.result || cogneeData.text || aiText;
          }

          // Extract action block if present
          const actionMatch = aiText.match(/\|\|ACTION_LEDGER:(.*?)\|\|/);
          if (actionMatch) {
            try {
              aiAction = JSON.parse(actionMatch[1]);
              aiText = aiText.replace(actionMatch[0], '').trim();
            } catch (e) {
              console.error("Failed to parse action json", e);
            }
          }

          // Background async remember entry
          fetch(`${cogneeApiUrl}/api/v1/remember/entry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Api-Key': cogneeApiKey },
            body: JSON.stringify({
              entry: { type: "qa", question: userText, answer: aiText },
              dataset_name: "saarthi_merchant_memory",
              session_id: sessionId
            })
          }).catch(() => {});
        } else {
          console.error("[Cognee API Error]:", await cogneeResponse.text());
        }
      } catch (cogneeErr) {
        console.error("[Cognee Network Error]:", cogneeErr);
      }
    }

    // 3. TTS (Text to Speech) via Sarvam
    let audioBase64 = null;
    if (sarvamApiKey) {
      try {
        let safeTtsText = aiText;
        if (safeTtsText.length > 490) {
          const match = safeTtsText.slice(0, 490).match(/(.*[.!?\u0964\n])/s);
          safeTtsText = match ? match[1] : safeTtsText.slice(0, 490) + '...';
        }

        const ttsResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': sarvamApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: [safeTtsText],
            target_language_code: reqLanguage,
            speaker: "priya",
            pitch: 0,
            pace: 1.05,
            loudness: 1.0,
            speech_sample_rate: 24000,
            enable_preprocessing: true,
            model: "bulbul:v3"
          }),
        });

        if (ttsResponse.ok) {
          const ttsData = await ttsResponse.json();
          audioBase64 = ttsData.audios?.[0];
        } else {
          console.error("[Sarvam TTS Error]:", await ttsResponse.text());
        }
      } catch (ttsErr) {
        console.error("[Sarvam TTS Network Error]:", ttsErr);
      }
    }

    // 4. Data Layer (Supabase) via Server Client with try-catch resilience
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await supabaseServer.from('conversation_turn').insert([
          { role: 'user', content: userText },
          { role: 'assistant', content: aiText }
        ]);
      }
    } catch (dbErr) {
      console.warn('[Database Logging Warning]:', dbErr);
    }

    // 5. Automation Webhook (n8n)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: merchantId,
          user_query: userText,
          ai_response: aiText,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      userText,
      aiText,
      action: aiAction,
      audioUrl: audioBase64 ? `data:audio/wav;base64,${audioBase64}` : null
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
