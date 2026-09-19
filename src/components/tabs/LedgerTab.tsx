'use client';

import React, { useState, useEffect } from 'react';
import { RECENT_TRANSACTIONS } from '@/lib/mockData';
import { Transaction } from '@/lib/types';
import { soundService } from '@/lib/soundEffects';
import {
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Plus,
  Volume2,
  Wallet,
  Search,
  Filter,
} from 'lucide-react';

export const LedgerTab: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);
  const [filterType, setFilterType] = useState<'all' | 'received' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New transaction form state
  const [newCustomer, setNewCustomer] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newType, setNewType] = useState<'received' | 'pending'>('received');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('saarthi_ledger');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Sync to global array and localStorage on change
  useEffect(() => {
    if (transactions === RECENT_TRANSACTIONS) return; // Ignore initial default reference
    
    RECENT_TRANSACTIONS.length = 0;
    RECENT_TRANSACTIONS.push(...transactions);
    localStorage.setItem('saarthi_ledger', JSON.stringify(transactions));
    window.dispatchEvent(new CustomEvent('LEDGER_UPDATED'));
  }, [transactions]);

  // Listen for voice-triggered ledger additions
  useEffect(() => {
    const handleAddEntry = (e: any) => {
      const payload = e.detail;
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          customerName: payload.name || 'Unknown',
          amount: Number(payload.amount) || 0,
          type: payload.type === 'pending' ? 'pending' : 'received',
          date: new Date().toISOString(),
          note: 'Added via Voice Assistant',
          paymentMode: 'cash',
          timestamp: 'Just now',
          timeAgo: '0 min ago',
        },
        ...prev,
      ]);
      soundService.playSuccessChime();
    };

    window.addEventListener('ADD_LEDGER_ENTRY', handleAddEntry);
    return () => window.removeEventListener('ADD_LEDGER_ENTRY', handleAddEntry);
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalReceived = transactions
    .filter((t) => t.type === 'received')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.type === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleSendReminder = (tx: Transaction) => {
    soundService.playSuccessChime();
    const message = encodeURIComponent(
      `Namaste ${tx.customerName} ji! Sharma Kirana Store se aapka ₹${tx.amount} ka hisab pending hai (${tx.note || 'Grocery'}). Kripya UPI ya cash se clear kar dein. Dhanyawaad!`
    );
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newAmount) return;

    soundService.playSuccessChime();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerName: newCustomer,
      amount: parseFloat(newAmount),
      type: newType,
      paymentMode: newType === 'received' ? 'upi' : 'cash',
      timestamp: 'Just now',
      timeAgo: 'Few seconds ago',
      note: newNote || (newType === 'received' ? 'Direct Payment' : 'Khata entry'),
      soundboxVerified: newType === 'received',
    };

    setTransactions([newTx, ...transactions]);
    setShowAddModal(false);
    setNewCustomer('');
    setNewAmount('');
    setNewNote('');
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 1. Header Banner & Action */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#0043cf] tracking-tight">
            Khata & Ledger
          </h2>
          <p className="text-[13px] text-[#3d484f]">
            Real-time shop collections & customer Udhaar
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#0043cf] hover:bg-[#0043cf] active:scale-95 text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* 2. Ledger Metric Overview Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Total Received (Jama) */}
        <div className="bg-white p-4 rounded-2xl border border-[#c4f0db] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006b47]">
              Total Received
            </span>
            <span className="w-7 h-7 rounded-full bg-[#eafaf1] flex items-center justify-center text-[#00a86b]">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[22px] font-black text-[#005e3e] tracking-tight block">
            ₹{totalReceived.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#006b47] font-semibold flex items-center gap-1 mt-0.5">
            <Volume2 className="w-3 h-3 text-[#00a86b]" /> Soundbox verified
          </span>
        </div>

        {/* Pending Udhaar */}
        <div className="bg-white p-4 rounded-2xl border border-[#ffdad6] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a]">
              Pending Udhaar
            </span>
            <span className="w-7 h-7 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[22px] font-black text-[#ba1a1a] tracking-tight block">
            ₹{totalPending.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#93000a] font-semibold block mt-0.5">
            {transactions.filter((t) => t.type === 'pending').length} customers due
          </span>
        </div>
      </div>


      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#6d7980] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customer or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-9 pr-3 py-2 text-[12px] rounded-xl border border-[#bcc8d0]/60 text-[#191c1e] placeholder:text-[#6d7980] focus:outline-none focus:border-[#0043cf]"
          />
        </div>

        <div className="flex bg-[#e6e8eb] p-0.5 rounded-xl border border-[#bcc8d0]/40 shrink-0">
          {(['all', 'received', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilterType(tab);
                soundService.playSuccessChime();
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] capitalize font-bold transition-all ${
                filterType === tab
                  ? 'bg-white text-[#0043cf] shadow-sm'
                  : 'text-[#3d484f] hover:text-[#191c1e]'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'received' ? 'Jama' : 'Udhaar'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Transactions List */}
      <div className="flex flex-col gap-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-[#e0e3e6]">
            <p className="text-[13px] text-[#6d7980]">No transactions found matching your filter.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isReceived = tx.type === 'received';

            return (
              <div
                key={tx.id}
                className="bg-white p-3.5 rounded-2xl border border-[#e0e3e6] shadow-[0_2px_8px_rgba(0,37,110,0.03)] hover:border-[#bcc8d0] transition-all flex items-center justify-between gap-3"
              >
                {/* Left Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isReceived ? 'bg-[#eafaf1] text-[#006b47]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {isReceived ? (
                      <Volume2 className="w-5 h-5 text-[#00a86b]" />
                    ) : (
                      <Clock className="w-5 h-5 text-[#ba1a1a]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[14px] font-bold text-[#191c1e] truncate">
                        {tx.customerName}
                      </h4>
                      {tx.soundboxVerified && (
                        <span className="material-symbols-outlined text-[#00a86b] text-[16px]">
                          check_circle
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6d7980] truncate">
                      {tx.note || 'Payment'} • {tx.timeAgo}
                    </p>
                  </div>
                </div>

                {/* Right Amount & Action */}
                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`text-[16px] font-black tracking-tight ${
                      isReceived ? 'text-[#005e3e]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {isReceived ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>

                  {!isReceived ? (
                    <button
                      onClick={() => handleSendReminder(tx)}
                      className="mt-1 px-2.5 py-0.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 active:scale-95 text-[#075e54] text-[10px] font-bold rounded-full flex items-center gap-1 border border-[#25D366]/30 transition-all"
                    >
                      <MessageSquare className="w-3 h-3 text-[#25D366]" /> Remind
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#006b47] font-semibold uppercase tracking-wider">
                      Received
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#e0e3e6]">
            <h3 className="text-[18px] font-bold text-[#0043cf] mb-1">Add Manual Entry</h3>
            <p className="text-[12px] text-[#6d7980] mb-4">
              Record offline cash payment or customer Udhaar
            </p>

            <form onSubmit={handleAddTransaction} className="flex flex-col gap-3">
              {/* Type Switcher */}
              <div className="flex bg-[#f2f4f7] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewType('received')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    newType === 'received' ? 'bg-[#00a86b] text-white shadow-sm' : 'text-[#3d484f]'
                  }`}
                >
                  Payment Received (Jama)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('pending')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    newType === 'pending' ? 'bg-[#ba1a1a] text-white shadow-sm' : 'text-[#3d484f]'
                  }`}
                >
                  Udhaar Given (Khata)
                </button>
              </div>

              {/* Customer Name */}
              <div>
                <label className="text-[11px] font-bold text-[#3d484f] uppercase block mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mukesh Kumar"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-[#f7f9fc] border border-[#bcc8d0] rounded-xl px-3 py-2 text-sm text-[#191c1e] focus:outline-none focus:border-[#0043cf]"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-[11px] font-bold text-[#3d484f] uppercase block mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 350"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-[#f7f9fc] border border-[#bcc8d0] rounded-xl px-3 py-2 text-sm text-[#191c1e] focus:outline-none focus:border-[#0043cf]"
                />
              </div>

              {/* Note / Items */}
              <div>
                <label className="text-[11px] font-bold text-[#3d484f] uppercase block mb-1">
                  Items / Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2kg Rice, Soap"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-[#f7f9fc] border border-[#bcc8d0] rounded-xl px-3 py-2 text-sm text-[#191c1e] focus:outline-none focus:border-[#0043cf]"
                />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 rounded-xl border border-[#bcc8d0] text-sm font-semibold text-[#3d484f] hover:bg-[#f2f4f7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#0043cf] text-white text-sm font-bold shadow-md hover:bg-[#0043cf] active:scale-95"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
