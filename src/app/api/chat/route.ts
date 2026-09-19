import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    
    // If no audio is provided, try parsing as text for fallback
    let userText = "";
    if (!audioFile) {
       const text = formData.get('text');
       if (text) {
         userText = text.toString();
       } else {
         return NextResponse.json({ error: 'No audio or text provided' }, { status: 400 });
       }
    }

    const sarvamApiKey = process.env.SARVAM_API_KEY;
    
    // Default to the user's selected language from settings for text queries
    let reqLanguage = (formData.get('language') as string) || 'hi-IN';

    // 1. STT (Speech to Text) via Sarvam if audio is provided
    if (audioFile && sarvamApiKey) {
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
        userText = sttData.transcript || userText;
        if (sttData.language_code) {
          reqLanguage = sttData.language_code; // Override with auto-detected language
        }
      }
    }

    // 1.5 Wake word short-circuit
    const isWakeWordMode = formData.get('wakeWordCheck') === 'true';
    if (isWakeWordMode && userText) {
      const lowerText = userText.toLowerCase();
      console.log(`[Auto-Listen] Captured transcript: "${userText}"`);
      // Check for Saarthi in English or Hindi script, mostly focusing on the phonetic presence
      const hasWakeWord = lowerText.includes('saarthi') || lowerText.includes('sarthi') || lowerText.includes('सारथी') || lowerText.includes('sharthi') || lowerText.includes('sarti') || lowerText.includes('sarathi') || lowerText.includes('sarathy');
      if (!hasWakeWord) {
        console.log(`[Auto-Listen] Wake word MISS.`);
        return NextResponse.json({ wakeWordMiss: true, userText }, { status: 200 });
      }
      console.log(`[Auto-Listen] Wake word HIT!`);
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

    // 2. Cognee Memory Layer (Knowledge Graph) & LLM Generation
    const cogneeApiUrl = process.env.COGNEE_BASE_URL;
    const cogneeApiKey = process.env.COGNEE_API_KEY;
    const sessionId = "session_saarthi_" + new Date().toISOString().split('T')[0];

    let aiText = "मुझे समझ नहीं आया।"; // Fallback
    let aiAction: any = null;

    if (cogneeApiUrl && cogneeApiKey) {
      // Mocking real-time business intelligence retrieval for the LLM context
      const businessIntelligence = `
        Current Business Status (Merchant PTM88291048):
        - Daily Transactions: ₹8,450 (Up 12.5% from yesterday)
        - Profit Margin: 22% overall
        - Ledger/Udhaar Balances: ₹2,100 pending from 3 high-risk accounts (Ramesh, Suresh, Mahesh).
        - Staffing Updates: Cashier Rahul is on leave today. Amit is covering the morning shift.
        - Operational Alerts: Fasting essentials (Sabudana) demand surging by 55% for Navratri.
      `;

      const enrichedQuery = `System: You are Saarthi, a voice-interactive financial AI. Reply in concise conversational ${targetLanguageName} ONLY. Do not use English script if the language is regional.
If the user wants to log, add, or record a transaction/ledger entry (e.g. Udhaar, Jama, payment received, credit), include this exact string format AT THE VERY END of your response: ||ACTION_LEDGER:{"name":"<customer_name>", "amount":<amount_as_number>, "type":"<received|pending>"}||

Business Context: ${businessIntelligence}
User Question: ${userText}`;

      // Recall memory and generate completion using Cognee's internal LLM
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
        
        // Extract the action block if present
        const actionMatch = aiText.match(/\|\|ACTION_LEDGER:(.*?)\|\|/);
        if (actionMatch) {
          try {
            aiAction = JSON.parse(actionMatch[1]);
            aiText = aiText.replace(actionMatch[0], '').trim();
          } catch (e) {
            console.error("Failed to parse action json", e);
          }
        }
        
        // Background: Remember this turn in Cognee
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
        console.error("Cognee API Error:", await cogneeResponse.text());
      }
    }

    // 3. TTS (Text to Speech) via Sarvam
    let audioBase64 = null;
    if (sarvamApiKey) {
      const ttsResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': sarvamApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [aiText],
          target_language_code: reqLanguage, // Dynamic TTS language
          speaker: "priya",
          pitch: 0, pace: 1.05, loudness: 1.0, // Normalized for natural human tone
          speech_sample_rate: 24000, // Upgraded from 8000Hz (telephony) to 24000Hz (HD Studio) to eliminate robotic distortion
          enable_preprocessing: true,
          model: "bulbul:v3"
        }),
      });

      if (ttsResponse.ok) {
        const ttsData = await ttsResponse.json();
        audioBase64 = ttsData.audios?.[0];
      } else {
        console.error("TTS API Error:", await ttsResponse.text());
      }
    }

    // 4. Data Layer (Supabase) & Automation (n8n)
    await supabase.from('conversations').insert([{
      customer_id: "merchant_session",
      merchant_id: "PTM88291048",
      user_message: userText,
      ai_message: aiText,
    }]);

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: "PTM88291048", user_query: userText, ai_response: aiText, timestamp: new Date().toISOString() })
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
