const fs = require('fs');

// 1. Update page.tsx
let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');
const pendingCountTarget = `  // Count pending Udhaar transactions for bottom nav badge
  const pendingCount = RECENT_TRANSACTIONS.filter((t) => t.type === 'pending').length;`;

const pendingCountReplacement = `  // Count pending Udhaar transactions for bottom nav badge
  const [pendingCount, setPendingCount] = useState(0);

  React.useEffect(() => {
    // 1. Load from localStorage if present
    const saved = localStorage.getItem('saarthi_ledger');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        RECENT_TRANSACTIONS.length = 0;
        RECENT_TRANSACTIONS.push(...parsed);
      } catch (e) {}
    }
    // 2. Initial count set
    setPendingCount(RECENT_TRANSACTIONS.filter((t) => t.type === 'pending').length);
    
    // 3. Listen for future updates
    const updateBadge = () => setPendingCount(RECENT_TRANSACTIONS.filter((t) => t.type === 'pending').length);
    window.addEventListener('LEDGER_UPDATED', updateBadge);
    return () => window.removeEventListener('LEDGER_UPDATED', updateBadge);
  }, []);`;

pageCode = pageCode.replace(pendingCountTarget, pendingCountReplacement);
fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');

// 2. Update LedgerTab.tsx
let ledgerCode = fs.readFileSync('src/components/tabs/LedgerTab.tsx', 'utf8');

// Add the effects right after useState declarations
const ledgerUseStateTarget = `  const [newType, setNewType] = useState<'received' | 'pending'>('received');`;
const ledgerUseStateReplacement = `  const [newType, setNewType] = useState<'received' | 'pending'>('received');

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
  }, [transactions]);`;

ledgerCode = ledgerCode.replace(ledgerUseStateTarget, ledgerUseStateReplacement);
fs.writeFileSync('src/components/tabs/LedgerTab.tsx', ledgerCode, 'utf8');

console.log('Persistence logic injected!');
