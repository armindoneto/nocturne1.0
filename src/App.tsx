/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import {
  Utensils,
  ShoppingBag,
  TrendingUp,
  Fuel,
  Tv,
  HeartPulse,
  Gamepad2,
  HelpCircle,
  Home,
  Wallet,
  CreditCard as CardIcon,
  User as UserIcon,
  Search,
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  RotateCcw,
  PlusCircle,
  Percent,
  Banknote,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Landmark,
  GripVertical,
  Clock,
  Flame,
  Zap
} from 'lucide-react';

import { Transaction, CreditCard, Account, UserProfile, ActiveTab, TempCategory, TempEntry } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  INITIAL_USER,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CARDS,
  CATEGORIES_WITH_ICONS,
  AVAILABLE_ACCOUNTS
} from './data';
import TransactionForm from './components/TransactionForm';
import CardItem from './components/CardItem';

export const ACCOUNT_COLORS = [
  { value: 'brand-primary', label: 'Dourado', bgClass: 'bg-brand-primary' },
  { value: 'emerald-400', label: 'Verde', bgClass: 'bg-emerald-400' },
  { value: 'purple-400', label: 'Roxo', bgClass: 'bg-purple-400' },
  { value: 'blue-400', label: 'Azul', bgClass: 'bg-blue-400' },
  { value: 'red-400', label: 'Vermelho', bgClass: 'bg-red-400' },
  { value: 'orange-400', label: 'Laranja', bgClass: 'bg-orange-400' },
  { value: 'cyan-400', label: 'Ciano', bgClass: 'bg-cyan-400' },
  { value: 'slate-400', label: 'Cinza', bgClass: 'bg-slate-400' },
];

export const getAccountColorClasses = (colorValue?: string) => {
  switch (colorValue) {
    case 'emerald-400': return 'bg-emerald-400 shadow-sm shadow-emerald-400/50';
    case 'purple-400': return 'bg-purple-400 shadow-sm shadow-purple-400/50';
    case 'blue-400': return 'bg-blue-400 shadow-sm shadow-blue-400/50';
    case 'red-400': return 'bg-red-400 shadow-sm shadow-red-400/50';
    case 'orange-400': return 'bg-orange-400 shadow-sm shadow-orange-400/50';
    case 'cyan-400': return 'bg-cyan-400 shadow-sm shadow-cyan-400/50';
    case 'slate-400': return 'bg-slate-400 shadow-sm shadow-slate-400/50';
    case 'brand-primary':
    default:
      return 'bg-brand-primary shadow-sm shadow-brand-primary/50';
  }
};

interface AccountItemProps {
  acc: Account;
  onEdit: (acc: Account) => void;
  onDelete: (acc: Account) => void;
  onAddBalance: (acc: Account) => void;
  onSubBalance: (acc: Account) => void;
  key?: React.Key;
}

function AccountItem({ acc, onEdit, onDelete, onAddBalance, onSubBalance }: AccountItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={acc}
      dragListener={false}
      dragControls={dragControls}
      className="bg-bg-surface-low border border-outline-variant/50 rounded-xl p-3.5 space-y-2 transition-all hover:border-outline-variant select-none active:cursor-grabbing relative"
      id={`card-account-${acc.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-brand-primary transition-colors flex items-center justify-center touch-none mr-0.5"
            title="Arrastar para reordenar"
          >
            <GripVertical size={13} strokeWidth={2.5} />
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${getAccountColorClasses(acc.color)}`} />
          <span className="text-[11px] font-bold text-white uppercase tracking-wide">{acc.name}</span>
        </div>
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onEdit(acc)}
            className="text-text-muted hover:text-brand-primary p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
            title="Editar conta"
            id={`btn-edit-acc-${acc.id}`}
          >
            <Edit3 size={12} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(acc)}
            className="text-text-muted hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center"
            title="Remover conta"
            id={`btn-delete-acc-${acc.id}`}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-base font-bold font-mono text-white tracking-tight mt-0.5">
            R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Botões rápidos ao lado do saldo */}
        <div className="flex gap-1.5 select-none shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onAddBalance(acc)}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-extrabold uppercase text-[8px] tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
            id={`btn-open-add-dialog-${acc.id}`}
          >
            <ArrowUpRight size={10} strokeWidth={3} /> Somar
          </button>
          <button
            type="button"
            onClick={() => onSubBalance(acc)}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-extrabold uppercase text-[8px] tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
            id={`btn-open-sub-dialog-${acc.id}`}
          >
            <ArrowDownLeft size={10} strokeWidth={3} /> Subtrair
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function App() {
  // --- Persistent States ---
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nocturne_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        if (parsed.customMainAccount === 'Aeternum') {
          parsed.customMainAccount = 'Æternum';
        }
        return parsed;
      } catch (_) {}
    }
    return INITIAL_USER;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('nocturne_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Account[];
        return parsed.map(acc => acc.name === 'Aeternum' ? { ...acc, name: 'Æternum' } : acc);
      } catch (_) {}
    }
    return INITIAL_ACCOUNTS;
  });

  const [budgetAccounts, setBudgetAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('nocturne_budget_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Account[];
        const requiredNames = ['Æternum', 'Repo Nu', 'Nubank', 'Pai', 'Mercado Livre'];
        return requiredNames.map((name, index) => {
          const found = parsed.find(a => a.name === name);
          return {
            id: found ? found.id : `b${index + 1}`,
            name,
            balance: found ? found.balance : 0.00
          };
        });
      } catch (_) {}
    }
    return [
      { id: 'b1', name: 'Æternum', balance: 0.00 },
      { id: 'b2', name: 'Repo Nu', balance: 0.00 },
      { id: 'b3', name: 'Nubank', balance: 0.00 },
      { id: 'b4', name: 'Pai', balance: 0.00 },
      { id: 'b5', name: 'Mercado Livre', balance: 0.00 },
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nocturne_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Transaction[];
        return parsed.map(tx => tx.account === 'Aeternum' ? { ...tx, account: 'Æternum' } : tx);
      } catch (_) {}
    }
    return INITIAL_TRANSACTIONS;
  });

  const [cards, setCards] = useState<CreditCard[]>(() => {
    const saved = localStorage.getItem('nocturne_cards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CreditCard[];
        return parsed.map(c => c.brand === 'Aeternum Infinite' ? { ...c, brand: 'Æternum Infinite' } : c);
      } catch (_) {}
    }
    return INITIAL_CARDS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('transacoes'); // Standard initially is 'transacoes' (matches user screenshot)
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);

  // --- Search & Filter States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('all');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // --- Custom Period States ---
  const [periodActive, setPeriodActive] = useState<boolean>(() => {
    return localStorage.getItem('nocturne_period_active') === 'true';
  });

  const [periodStart, setPeriodStart] = useState<string>(() => {
    return localStorage.getItem('nocturne_period_start') || '';
  });

  const [periodEnd, setPeriodEnd] = useState<string>(() => {
    return localStorage.getItem('nocturne_period_end') || '';
  });

  const [periodTotal, setPeriodTotal] = useState<number>(() => {
    const saved = localStorage.getItem('nocturne_period_total');
    return saved ? parseFloat(saved) : 0;
  });

  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // --- Navigation & Account Management Screens States ---
  const [activeScreen, setActiveScreen] = useState<'budget' | 'contas' | 'temp'>('budget');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');
  const [newAccountColor, setNewAccountColor] = useState<string>('brand-primary');
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isAdjustBalanceModalOpen, setIsAdjustBalanceModalOpen] = useState(false);
  const [selectedAdjustingAccount, setSelectedAdjustingAccount] = useState<Account | null>(null);
  const [adjustingType, setAdjustingType] = useState<'somar' | 'subtrair' | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [editAccountName, setEditAccountName] = useState('');
  const [editAccountBalance, setEditAccountBalance] = useState('');
  const [editAccountColor, setEditAccountColor] = useState<string>('brand-primary');
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  // --- Temporary Information Screen States ---
  const [tempCategories, setTempCategories] = useState<TempCategory[]>(() => {
    const saved = localStorage.getItem('nocturne_temp_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'temp-1',
        name: 'Viagem de Fim de Semana',
        entries: [
          { id: 'te-1', description: 'Gasolina', amount: 150.00, date: '21/06/2026' },
          { id: 'te-2', description: 'Pedágio', amount: 22.40, date: '21/06/2026' },
          { id: 'te-3', description: 'Hospedagem', amount: 450.00, date: '21/06/2026' },
        ],
      },
      {
        id: 'temp-2',
        name: 'Churrasco de Aniversário',
        entries: [
          { id: 'te-4', description: 'Carnes', amount: 280.00, date: '21/06/2026' },
          { id: 'te-5', description: 'Bebidas', amount: 120.00, date: '21/06/2026' },
        ],
      }
    ];
  });

  const [isNewTempCategoryModalOpen, setIsNewTempCategoryModalOpen] = useState(false);
  const [newTempCategoryName, setNewTempCategoryName] = useState('');
  const [newEntryDesc, setNewEntryDesc] = useState<{[catId: string]: string}>({});
  const [newEntryAmount, setNewEntryAmount] = useState<{[catId: string]: string}>({});

  // --- Toast notification for micro-interactions ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('nocturne_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nocturne_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('nocturne_budget_accounts', JSON.stringify(budgetAccounts));
  }, [budgetAccounts]);

  useEffect(() => {
    localStorage.setItem('nocturne_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nocturne_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('nocturne_period_active', String(periodActive));
  }, [periodActive]);

  useEffect(() => {
    localStorage.setItem('nocturne_period_start', periodStart);
  }, [periodStart]);

  useEffect(() => {
    localStorage.setItem('nocturne_period_end', periodEnd);
  }, [periodEnd]);

  useEffect(() => {
    localStorage.setItem('nocturne_period_total', String(periodTotal));
  }, [periodTotal]);

  useEffect(() => {
    localStorage.setItem('nocturne_temp_categories', JSON.stringify(tempCategories));
  }, [tempCategories]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalPeriodDays = useMemo(() => {
    if (!periodStart || !periodEnd) return 1;
    const s = new Date(periodStart + 'T00:00:00');
    const e = new Date(periodEnd + 'T00:00:00');
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
  }, [periodStart, periodEnd]);

  const elapsedDays = useMemo(() => {
    if (!periodActive || !periodStart || !periodEnd) return 1;
    const start = new Date(periodStart + 'T00:00:00');
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(periodEnd + 'T00:00:00');
    end.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (today < start) {
      return 1;
    }
    if (today > end) {
      return totalPeriodDays;
    }
    
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
  }, [periodActive, periodStart, periodEnd, totalPeriodDays]);

  const daysRemaining = useMemo(() => {
    if (!periodActive || !periodEnd) return 1;
    const end = new Date(periodEnd + 'T00:00:00');
    end.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (today > end) {
      return 1;
    }
    
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) || diffDays < 1 ? 1 : diffDays;
  }, [periodActive, periodEnd]);

  // --- Dynamic Accounting Calculus ---
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.balance, 0);
  }, [accounts]);

  const remainingTotalPeriodBudget = useMemo(() => {
    if (!periodActive) return periodTotal;
    const currentTransactionsSum = transactions.reduce((sum, t) => sum + t.amount, 0);
    return periodTotal + currentTransactionsSum;
  }, [transactions, periodActive, periodTotal]);

  const saldoDoDia = useMemo(() => {
    if (periodActive) {
      return remainingTotalPeriodBudget / daysRemaining;
    }

    // Current total for today (mock/real computed for the selected newest date '2026-10-24')
    // We sum up the transactions of that specific day
    const newestDate = '2026-10-24';
    const dayConclued = transactions.filter(t => t.date === newestDate);
    // Let's display the constant R$ 2.450,00, but update dynamically if modified/added!
    const updatedTodayOutcome = dayConclued.reduce((sum, t) => sum + t.amount, 0);
    // Absolute representative base value or computed:
    // If user deleted or modified the original items, reflect it. 
    return 2450.00 + (updatedTodayOutcome - (-295.00)); // offset by difference to initial day total
  }, [transactions, periodActive, periodTotal, totalPeriodDays, elapsedDays, remainingTotalPeriodBudget]);

  // Compute daily metrics and projections for the Analysis modal window
  const analysisData = useMemo(() => {
    if (!periodActive || !periodStart || !periodEnd) {
      return {
        initialDailyBudget: 0,
        daysElapsed: 0,
        projectedBudget: 0,
        totalExpenses: 0,
        projectedBalance: 0,
        daysList: []
      };
    }

    const start = new Date(periodStart + 'T00:00:00');
    start.setHours(0, 0, 0, 0);

    const initialDailyBudget = periodTotal / totalPeriodDays;
    // Number of days in the period that have already occurred so far (up to the current day)
    const daysElapsed = Math.max(1, elapsedDays);

    const daysList = [];

    for (let j = 0; j < daysElapsed; j++) {
      const currentDayDateObj = new Date(start.getTime() + j * 24 * 60 * 60 * 1000);
      const year = currentDayDateObj.getFullYear();
      const month = String(currentDayDateObj.getMonth() + 1).padStart(2, '0');
      const dateVal = String(currentDayDateObj.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateVal}`;

      // Sum transactions strictly dated before the current day to understand budget at starting moment
      const txsBeforeCurrentDay = transactions.filter(t => t.date < dateStr);
      const accumulatedTxSumBefore = txsBeforeCurrentDay.reduce((sum, t) => sum + t.amount, 0);

      const remainingDaysFromThisDay = totalPeriodDays - j;
      const budgetAtStartOfDay = periodTotal + accumulatedTxSumBefore;
      
      // Saldo do dia assigned immediately as the day started
      const dailySaldoAtStart = remainingDaysFromThisDay > 0 ? (budgetAtStartOfDay / remainingDaysFromThisDay) : 0;

      // Filter all transactions on that specific day
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      
      // Calculate total expense (negative values)
      const dayExpenses = dayTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      // Balance of the day (starting budget minus day expenses)
      const dailyNetBalance = dailySaldoAtStart - dayExpenses;

      daysList.push({
        dayNumber: j + 1,
        dateFormatted: `${dateVal}/${month}/${String(year).substring(2)}`,
        dateStr,
        dailySaldoAtStart,
        dayExpenses,
        dailyNetBalance,
      });
    }

    // Projection calculation:
    // "caso todos os dias tivessem este mesmo valor, qual seria o balanço entre a soma dos saldos do dia ate o momento e o total de despesas realizadas"
    const projectedBudget = initialDailyBudget * daysElapsed;
    const totalExpenses = daysList.reduce((sum, d) => sum + d.dayExpenses, 0);
    const projectedBalance = projectedBudget - totalExpenses;
    const averageDailyExpenses = daysElapsed > 0 ? (totalExpenses / daysElapsed) : 0;

    return {
      initialDailyBudget,
      daysElapsed,
      projectedBudget,
      totalExpenses,
      projectedBalance,
      averageDailyExpenses,
      daysList: daysList.reverse() // show latest days first
    };
  }, [periodActive, periodStart, periodEnd, periodTotal, totalPeriodDays, elapsedDays, transactions]);

  // Chronological data for the daily budget bar chart in Analysis modal
  const chartData = useMemo(() => {
    return [...analysisData.daysList].reverse().map(d => ({
      name: `D${d.dayNumber}`,
      'Limite Atribuído': Number(d.dailySaldoAtStart.toFixed(2)),
    }));
  }, [analysisData.daysList]);

  // Accounts balance map
  const accountsMap = useMemo(() => {
    return new Map(budgetAccounts.map(acc => [acc.name, acc]));
  }, [budgetAccounts]);

  // Category Icon map resolver
  const getCategoryIconAndColor = (category: string) => {
    const found = CATEGORIES_WITH_ICONS.find(c => c.name === category);
    const classesProps = found ? found.color : 'text-slate-400 bg-slate-500/10';
    
    let lucideIcon = <HelpCircle size={18} />;
    switch (category) {
      case 'Alimentação':
        lucideIcon = <Utensils size={18} />;
        break;
      case 'Processado':
        lucideIcon = <ShoppingBag size={18} />;
        break;
      case 'Depósito':
        lucideIcon = <TrendingUp size={18} />;
        break;
      case 'Transporte':
        lucideIcon = <Fuel size={18} />;
        break;
      case 'Assinaturas':
        lucideIcon = <Tv size={18} />;
        break;
      case 'Saúde':
        lucideIcon = <HeartPulse size={18} />;
        break;
      case 'Lazer':
        lucideIcon = <Gamepad2 size={18} />;
        break;
    }

    return { icon: lucideIcon, classes: classesProps };
  };

  // --- New Period Modal Inputs and logic ---
  const [modalPeriodStart, setModalPeriodStart] = useState('');
  const [modalPeriodEnd, setModalPeriodEnd] = useState('');
  const [modalPeriodTotal, setModalPeriodTotal] = useState('');

  useEffect(() => {
    if (isPeriodModalOpen) {
      setModalPeriodStart(periodStart || new Date().toISOString().split('T')[0]);
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      setModalPeriodEnd(periodEnd || futureDate.toISOString().split('T')[0]);
      
      setModalPeriodTotal(periodTotal > 0 ? String(periodTotal) : '2000');
    }
  }, [isPeriodModalOpen, periodActive, periodStart, periodEnd, periodTotal]);

  const handleConfirmNewPeriod = (startStr: string, endStr: string, total: number) => {
    // 1. Clear all old transactions
    setTransactions([]);
    
    // 2. Set period states
    setPeriodActive(true);
    setPeriodStart(startStr);
    setPeriodEnd(endStr);
    setPeriodTotal(total);

    // 3. Set all account spendings to 0
    setBudgetAccounts(prev => prev.map((acc) => {
      return { ...acc, balance: 0 };
    }));

    // 4. Trigger alert toast
    const daysCount = () => {
      const s = new Date(startStr + 'T00:00:00');
      const e = new Date(endStr + 'T00:00:00');
      const diffTime = e.getTime() - s.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
    };
    triggerToast(`Novo período de ${daysCount()} dias iniciado com sucesso!`);
  };

  // --- Transaction Create / Update / Delete handlers ---
  const handleSaveTransaction = (newTxData: Omit<Transaction, 'id'> & { id?: string }) => {
    if (newTxData.id) {
       // --- Update Flow ---
      const oldTx = transactions.find(t => t.id === newTxData.id);
      if (!oldTx) return;

      // Reverse previous accountant impact (spending should go down when old expense is removed)
      setBudgetAccounts(prevAccs => prevAccs.map(acc => {
        if (acc.name === oldTx.account && oldTx.amount < 0) {
          return { ...acc, balance: Math.max(0, acc.balance - Math.abs(oldTx.amount)) };
        }
        return acc;
      }));

      // Apply new accountant impact (spending should go up when new expense is registered)
      setBudgetAccounts(prevAccs => prevAccs.map(acc => {
        if (acc.name === newTxData.account && newTxData.amount < 0) {
          return { ...acc, balance: acc.balance + Math.abs(newTxData.amount) };
        }
        return acc;
      }));

      setTransactions(prev => prev.map(t => {
        if (t.id === newTxData.id) {
          return { ...t, ...newTxData } as Transaction;
        }
        return t;
      }));

      triggerToast('Lançamento atualizado com sucesso.');
    } else {
      // --- Create Flow ---
      const createdTx: Transaction = {
        ...newTxData,
        id: 'user_t_' + Date.now(),
      } as Transaction;

      // Adjust account balance corresponding to target account (spending goes up)
      setBudgetAccounts(prevAccs => prevAccs.map(acc => {
        if (acc.name === createdTx.account && createdTx.amount < 0) {
          return { ...acc, balance: acc.balance + Math.abs(createdTx.amount) };
        }
        return acc;
      }));

      setTransactions(prev => [createdTx, ...prev]);
      triggerToast('Novo lançamento registrado.');
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (txId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening dialog on item click

    const target = transactions.find(t => t.id === txId);
    if (!target) return;

    // Reverse spending: remove it from target account spending balance
    setBudgetAccounts(prevAccs => prevAccs.map(acc => {
      if (acc.name === target.account && target.amount < 0) {
        return { ...acc, balance: Math.max(0, acc.balance - Math.abs(target.amount)) };
      }
      return acc;
    }));

    setTransactions(prev => prev.filter(t => t.id !== txId));
    triggerToast('Lançamento excluído com sucesso.');
  };

  const handleEditClick = (tx: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  // --- Credit Card handlers ---
  const handlePayBill = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.used <= 0) return;

    // Ask which account to use to pay
    const options = budgetAccounts.map(a => `${a.name} (Saldo: R$ ${a.balance.toLocaleString('pt-BR')})`).join('\n');
    const selectedAccName = window.prompt(
      `Digite o nome exato da conta para pagar a fatura de R$ ${card.used.toLocaleString('pt-BR')} do ${card.brand}:\n\n${options}`,
      budgetAccounts[0]?.name
    );

    if (!selectedAccName) return;

    const targetAccount = budgetAccounts.find(a => a.name.trim().toLowerCase() === selectedAccName.trim().toLowerCase());
    if (!targetAccount) {
      alert('Conta não encontrada. Certifique-se de digitar o nome exatamente.');
      return;
    }

    if (targetAccount.balance < card.used) {
      alert('Saldo insuficiente na conta selecionada para cobrir o pagamento.');
      return;
    }

    // Process payment
    setBudgetAccounts(prev => prev.map(a => {
      if (a.id === targetAccount.id) {
        return { ...a, balance: a.balance - card.used };
      }
      return a;
    }));

    // Register a mock outcome transaction of credit card payment
    const paymentTx: Transaction = {
      id: 'tx_pay_' + Date.now(),
      description: `Pagamento ${card.brand}`,
      amount: -card.used,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      account: targetAccount.name,
      category: 'Processado',
      status: 'processado'
    };

    setTransactions(prev => [paymentTx, ...prev]);

    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, used: 0 };
      }
      return c;
    }));

    triggerToast('Fatura paga com sucesso!');
  };

  const handleAdjustLimit = (cardId: string, newLimit: number) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, limit: newLimit };
      }
      return c;
    }));
    triggerToast('Limite ajustado com sucesso.');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = window.prompt('Nome do Cartão (ex: Æternum Infinite):', 'Mastercard Black');
    if (!brand) return;
    const holder = window.prompt('Nome do Titular:', user.name.toUpperCase());
    if (!holder) return;
    const limitInput = window.prompt('Limite total do Cartão:', '50000');
    if (!limitInput) return;
    const themeInput = window.prompt('Tema de Cor (gold, purple, slate, emerald):', 'emerald');
    if (!themeInput) return;

    const limitParsed = parseFloat(limitInput);
    if (isNaN(limitParsed) || limitParsed <= 0) {
      alert('Limite inválido!');
      return;
    }

    const newCard: CreditCard = {
      id: 'c_' + Date.now(),
      brand,
      holder: holder.toUpperCase(),
      lastFour: String(Math.floor(1000 + Math.random() * 9000)),
      expiry: '09/31',
      limit: limitParsed,
      used: 0,
      colorTheme: (['gold', 'purple', 'slate', 'emerald'].includes(themeInput) ? themeInput : 'gold') as any
    };

    setCards(prev => [...prev, newCard]);
    triggerToast(`Cartão ${brand} criado com sucesso.`);
  };

  // --- Reset/Seed Data ---
  const handleResetData = () => {
    if (window.confirm('Tem certeza que deseja restaurar os valores originais do app? Seus novos dados serão perdidos.')) {
      localStorage.clear();
      setUser(INITIAL_USER);
      setAccounts(INITIAL_ACCOUNTS);
      setBudgetAccounts([
        { id: 'b1', name: 'Æternum', balance: 0.00 },
        { id: 'b2', name: 'Repo Nu', balance: 0.00 },
        { id: 'b3', name: 'Nubank', balance: 0.00 },
        { id: 'b4', name: 'Pai', balance: 0.00 },
        { id: 'b5', name: 'Mercado Livre', balance: 0.00 },
      ]);
      setTransactions(INITIAL_TRANSACTIONS);
      setCards(INITIAL_CARDS);
      triggerToast('Dados restaurados com base na nossa inteligência fiscal.');
    }
  };

  const handleUpdateAccountBalance = (accId: string, newBalanceStr: string) => {
    const rawVal = parseFloat(newBalanceStr.replace(',', '.'));
    if (isNaN(rawVal)) return;

    setBudgetAccounts(prev => prev.map(acc => {
      if (acc.id === accId) {
        return { ...acc, balance: rawVal };
      }
      return acc;
    }));
    triggerToast('Gasto acumulado da conta atualizado.');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) {
      triggerToast('Por favor, informe o nome da conta.');
      return;
    }

    const exists = accounts.some(acc => acc.name.trim().toLowerCase() === newAccountName.trim().toLowerCase());
    if (exists) {
      triggerToast('Já existe uma conta com este nome.');
      return;
    }

    const initialBal = parseFloat(newAccountBalance.replace(',', '.')) || 0;
    const newAcc: Account = {
      id: 'acc_' + Math.random().toString(36).substr(2, 9),
      name: newAccountName.trim(),
      balance: initialBal,
      color: newAccountColor
    };

    setAccounts(prev => [...prev, newAcc]);
    setNewAccountName('');
    setNewAccountBalance('');
    setNewAccountColor('brand-primary');
    setIsNewAccountModalOpen(false);
    triggerToast(`Conta "${newAcc.name}" criada de forma segura.`);
  };

  const handleEditAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    if (!editAccountName.trim()) {
      triggerToast('Por favor, informe o nome da conta.');
      return;
    }

    const exists = accounts.some(acc => 
      acc.id !== editingAccount.id && 
      acc.name.trim().toLowerCase() === editAccountName.trim().toLowerCase()
    );
    if (exists) {
      triggerToast('Já existe outra conta com este nome.');
      return;
    }

    const updatedBal = parseFloat(editAccountBalance.replace(',', '.')) || 0;
    
    setAccounts(prev => prev.map(acc => {
      if (acc.id === editingAccount.id) {
        return {
          ...acc,
          name: editAccountName.trim(),
          balance: updatedBal,
          color: editAccountColor
        };
      }
      return acc;
    }));

    // Sincroniza o nome com budgetAccounts se bater
    setBudgetAccounts(prev => prev.map(acc => {
      if (acc.name === editingAccount.name) {
        return {
          ...acc,
          name: editAccountName.trim()
        };
      }
      return acc;
    }));

    setIsEditAccountModalOpen(false);
    setEditingAccount(null);
    triggerToast(`Conta "${editAccountName.trim()}" atualizada com sucesso.`);
  };

  const handleDeleteAccount = (id: string, name: string) => {
    if (accounts.length <= 1) {
      triggerToast('Mantenha pelo menos uma conta ativa para operacionalizar o app.');
      return;
    }
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    triggerToast(`Conta "${name}" removida com sucesso.`);
  };

  const handleCreateTempCategory = (name: string) => {
    if (!name.trim()) return;
    const newCat: TempCategory = {
      id: 'temp-' + Date.now(),
      name: name.trim(),
      entries: []
    };
    setTempCategories(prev => [...prev, newCat]);
    triggerToast(`Categoria "${name}" criada com sucesso!`);
  };

  const handleDeleteTempCategory = (id: string, name: string) => {
    setTempCategories(prev => prev.filter(cat => cat.id !== id));
    triggerToast(`Categoria "${name}" excluída.`);
  };

  const handleAddTempEntry = (catId: string, description: string, amountStr: string) => {
    if (!description.trim()) {
      triggerToast('A descrição do lançamento é obrigatória.');
      return;
    }
    const cleanAmountStr = amountStr.replace(/\s/g, '').replace(',', '.');
    const amountNum = parseFloat(cleanAmountStr);
    if (isNaN(amountNum) || amountNum <= 0) {
      triggerToast('Digite um valor válido maior que zero.');
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');

    const newEntry: TempEntry = {
      id: 'te-' + Date.now() + Math.random().toString(36).substring(2, 6),
      description: description.trim(),
      amount: amountNum,
      date: formattedDate
    };

    setTempCategories(prev => prev.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          entries: [...cat.entries, newEntry]
        };
      }
      return cat;
    }));

    // Clear input states for this category
    setNewEntryDesc(prev => ({ ...prev, [catId]: '' }));
    setNewEntryAmount(prev => ({ ...prev, [catId]: '' }));
    triggerToast('Lançamento temporário adicionado!');
  };

  const handleDeleteTempEntry = (catId: string, entryId: string) => {
    setTempCategories(prev => prev.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          entries: cat.entries.filter(e => e.id !== entryId)
        };
      }
      return cat;
    }));
    triggerToast('Lançamento temporário removido.');
  };

  const handleAdjustBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdjustingAccount || !adjustingType) return;

    if (!adjustmentAmount) {
      triggerToast('Digite um valor numérico para ajustar.');
      return;
    }
    
    const amount = parseFloat(adjustmentAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      triggerToast('Por favor, digite um valor maior que zero.');
      return;
    }

    const isAddition = adjustingType === 'somar';
    const change = isAddition ? amount : -amount;
    
    setAccounts(prev => prev.map(acc => {
      if (acc.id === selectedAdjustingAccount.id) {
        return {
          ...acc,
          balance: acc.balance + change
        };
      }
      return acc;
    }));

    setAdjustmentAmount('');
    setIsAdjustBalanceModalOpen(false);
    setSelectedAdjustingAccount(null);
    setAdjustingType(null);

    triggerToast(`${isAddition ? 'Depósito de' : 'Retirada de'} R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} concluído.`);
  };

  // --- Transaction queries & filters calculation ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.account.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchAccount = selectedAccountFilter === 'all' || t.account === selectedAccountFilter;

      return matchSearch && matchCategory && matchAccount;
    });
  }, [transactions, searchTerm, selectedCategory, selectedAccountFilter]);

  // Group transactions list by humanized dates
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: { txs: Transaction[]; dailySum: number } } = {};

    filteredTransactions.forEach(t => {
      // Format header keys in dd/mm/aa format
      let formattedHeader = t.date;
      try {
        const parts = t.date.split('-');
        const year = parts[0].substring(2);
        const month = parts[1];
        const day = parts[2];
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        
        let prefix = '';
        if (t.date === '2026-10-24') {
          prefix = 'Hoje, ';
        } else if (t.date === '2026-10-23') {
          prefix = 'Ontem, ';
        } else {
          prefix = `${daysOfWeek[dateObj.getDay()]}, `;
        }
        formattedHeader = `${prefix}${day}/${month}/${year}`;
      } catch (_) {
        formattedHeader = t.date;
      }

      if (!groups[formattedHeader]) {
        groups[formattedHeader] = { txs: [], dailySum: 0 };
      }

      groups[formattedHeader].txs.push(t);
      groups[formattedHeader].dailySum += t.amount;
    });

    return Object.entries(groups).map(([date, data]) => ({
      dateLabel: date,
      transactions: data.txs,
      dailySum: data.dailySum
    }));
  }, [filteredTransactions]);

  // Dynamic dashboard analytics (cashflows graph values)
  const dashboardStats = useMemo(() => {
    const totalOutcomesByCat: { [key: string]: number } = {};
    let totalIncomes = 0;
    let totalOutcomes = 0;

    transactions.forEach(t => {
      if (t.amount < 0) {
        totalOutcomes += Math.abs(t.amount);
        totalOutcomesByCat[t.category] = (totalOutcomesByCat[t.category] || 0) + Math.abs(t.amount);
      } else {
        totalIncomes += t.amount;
      }
    });

    const categoryDistribution = Object.entries(totalOutcomesByCat).map(([name, val]) => ({
      name,
      value: val,
      percentage: totalOutcomes > 0 ? (val / totalOutcomes) * 100 : 0
    })).sort((a, b) => b.value - a.value);

    return {
      totalIncomes,
      totalOutcomes,
      categoryDistribution
    };
  }, [transactions]);

  // --- Dynamic Greeting ---
  const activeGreeting = useMemo(() => {
    // Current time from metadata: 2026-06-21T06:35:08-07:00 => 6:35 AM
    const hour = 6; // morning
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  return (
    <div className="h-[100dvh] overflow-hidden bg-bg-base text-text-high font-sans selection:bg-brand-primary/20 flex flex-col justify-between max-w-md mx-auto relative shadow-2xl border-x border-outline-variant/40 md:mt-2 md:rounded-3xl md:h-[95vh] md:max-h-[920px] pb-0 custom-scrollbar" id="web-mobile-container">
      
      {/* Dynamic Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-neutral-900 border border-brand-primary/30 py-3 px-4 rounded-xl z-50 flex items-center justify-between shadow-2xl"
            id="toast-notification"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-brand-primary" size={18} />
              <span className="text-xs text-text-high font-medium">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-text-high">
              <RotateCcw size={14} className="animate-spin-hover" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Main Container Area */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-28 custom-scrollbar flex flex-col justify-between" id="content-scroller">
        <div className="flex-1 pb-6">
        
        {/* App Title Header with Generated Yellow/Black Icon */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10" id="app-brand-header">
          <img 
            src="/favicon.jpg" 
            alt="Nocturne Logo" 
            className="w-10 h-10 rounded-xl shadow-md border border-brand-primary/20 object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-base font-black tracking-tight text-white uppercase font-display leading-tight">Nocturne</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">Controle de Orçamento</p>
          </div>
        </div>

        {activeScreen === 'budget' && (
          <>
            {/* TAB 1: INÍCIO (DASHBOARD) */}
        {activeTab === 'inicio' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            id="tab-inicio-view"
          >
            {/* Header Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-muted text-xs tracking-wider uppercase font-semibold">Portfólio Ativo</h3>
                <h2 className="text-2xl font-display font-black text-white mt-1">
                  {activeGreeting}, <span className="text-brand-secondary">{user.name.split(' ')[0]}</span>
                </h2>
              </div>
              <div className="bg-bg-surface-low border border-outline-variant px-3 py-1 text-[10px] font-mono rounded text-brand-primary">
                Prestige Club
              </div>
            </div>

            {/* Total balance micro cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface-low border border-outline-variant/50 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Total em Contas</span>
                  <p className="text-lg font-bold text-white mt-1">
                    R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-[10px] text-green-400 flex items-center gap-1 mt-2 font-mono">
                  <ArrowUpRight size={10} /> + R$ {dashboardStats.totalIncomes.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} entrada
                </div>
              </div>

              <div className="bg-bg-surface-low border border-outline-variant/50 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Limite Disponível</span>
                  <p className="text-lg font-bold text-white mt-1">
                    R$ {cards.reduce((sum, c) => sum + (c.limit - c.used), 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-[10px] text-red-500 flex items-center gap-1 mt-2 font-mono">
                  <ArrowDownLeft size={10} /> - R$ {dashboardStats.totalOutcomes.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} saída
                </div>
              </div>
            </div>

            {/* Cash Flow Custom Area Chart Widget */}
            <section className="bg-bg-surface-low border border-outline-variant/80 rounded-xl p-5 gold-glow shadow-md">
              <h4 className="text-[11px] uppercase tracking-widest text-text-muted font-bold mb-4">Performance e Volume Comercial</h4>
              
              <div className="h-32 w-full mt-2 relative flex items-end">
                {/* Visual gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 border-b border-white/5">
                  <div className="border-t border-white/5 w-full h-px" />
                  <div className="border-t border-white/5 w-full h-px" />
                  <div className="border-t border-white/10 w-full h-px" />
                </div>

                {/* Animated graphic SVG representation */}
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Area fill */}
                  <path
                    d="M 0 120 C 30 110, 60 70, 90 85 C 120 100, 150 40, 180 50 C 210 60, 240 10, 270 25 C 300 40, 330 90, 360 85 L 360 120 L 0 120 Z"
                    fill="url(#goldGradient)"
                    opacity="0.15"
                  />
                  {/* Grid-line path */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                    d="M 0 120 C 30 110, 60 70, 90 85 C 120 100, 150 40, 180 50 C 210 60, 240 10, 270 25 C 300 40, 330 90, 360 85"
                    fill="none"
                    stroke="#ffd700"
                    strokeWidth="2.5"
                  />
                  
                  {/* Decorative Gradient Def */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffd700" />
                      <stop offset="100%" stopColor="#050505" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Hover highlights */}
                <div className="absolute left-[38%] top-[30%] w-3 h-3 rounded-full bg-brand-primary border-2 border-black animate-ping" />
                <div className="absolute left-[38%] top-[30%] w-3 h-3 rounded-full bg-brand-primary border-2 border-black" />
                
                {/* floating tooltip */}
                <div className="absolute left-[44%] top-[10%] bg-bg-surface-high border border-brand-primary/20 px-2 py-1 rounded text-[10px] font-mono text-brand-primary z-20">
                  Dia 24: R$ 2.450,00
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-text-muted mt-2 font-mono">
                <span>Mai</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Ago</span>
                <span>Set</span>
                <span>Out (Atual)</span>
              </div>
            </section>

            {/* Category distribution visual block */}
            <section className="bg-bg-surface-low border border-outline-variant p-5 rounded-xl">
              <h4 className="text-[11px] uppercase tracking-widest text-text-muted font-bold mb-4">Concentração de Despesas</h4>
              <div className="space-y-3.5">
                {dashboardStats.categoryDistribution.slice(0, 4).map((item) => {
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-high font-medium">{item.name}</span>
                        <span className="font-mono text-text-muted">
                          R$ {item.value.toLocaleString('pt-BR')} ({item.percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-secondary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {dashboardStats.categoryDistribution.length === 0 && (
                  <p className="text-xs text-text-muted italic text-center py-4">Sem despesas registradas.</p>
                )}
              </div>
            </section>

            {/* Micro Quick Transactions log header */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[11px] uppercase tracking-widest text-text-muted font-bold">Lançamentos Recentes</h4>
                <button onClick={() => setActiveTab('transacoes')} className="text-[11px] text-brand-primary hover:underline font-bold">
                  Ver todos
                </button>
              </div>

              <div className="space-y-2">
                {transactions.slice(0, 3).map(t => {
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setEditingTransaction(t);
                        setIsFormOpen(true);
                      }}
                      className="flex items-center justify-between p-3.5 bg-bg-surface-low border border-outline-variant/30 hover:border-brand-primary/25 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs font-bold text-text-high group-hover:text-brand-primary transition-colors">{t.description}</p>
                          <p className="text-[10px] text-text-muted font-mono">{t.account} • {t.time}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${t.amount >= 0 ? 'text-green-500' : 'text-text-high'}`}>
                        {t.amount >= 0 ? '+' : '-'} R$ {Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: TRANSAÇÕES (THE DETAILED LIST & SEARCH ENGINE) */}
        {activeTab === 'transacoes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
            id="tab-transactions-view"
          >
            {/* Balance Hero Section exact copy */}
            <section className="relative overflow-hidden rounded-xl border-t-2 border-brand-primary p-6 bg-gradient-to-b from-bg-surface-low to-bg-base gold-glow border border-outline-variant/50 animate-glow" id="balance-hero">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-2.5 font-bold">Saldo do Dia</p>
                    <div className="flex items-baseline gap-1" id="daily-balance-display">
                      <span className="text-2xl font-black text-brand-primary font-display">R$</span>
                      <span className="text-4xl font-black text-white tracking-tighter font-display">
                        {saldoDoDia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Custom Period Buttons on the right side of the main card panel */}
                  <div className="flex flex-col gap-2 items-end" id="period-actions-group">
                    <button
                      onClick={() => setIsPeriodModalOpen(true)}
                      className="inline-flex items-center gap-1 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 hover:border-brand-primary text-brand-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer shadow-sm w-32 justify-center"
                      id="btn-define-period"
                    >
                      <Calendar size={12} />
                      Novo Período
                    </button>

                    <button
                      onClick={() => setIsAnalysisModalOpen(true)}
                      className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500 text-amber-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-250 cursor-pointer shadow-sm w-32 justify-center"
                      id="btn-open-analysis"
                    >
                      <TrendingUp size={12} strokeWidth={2.5} />
                      Análise
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-outline-variant/20 pt-3">
                  <span className="text-xs text-text-muted">
                    Saldo Mensal: <strong className="text-text-high font-bold">R$ {(periodActive ? remainingTotalPeriodBudget : totalBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </span>

                  {periodActive && (
                    <span className="text-[10px] text-brand-primary font-mono font-medium flex items-center gap-1.5 bg-brand-primary/5 px-2 py-0.5 rounded-md border border-brand-primary/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
                      Período: {new Date(periodStart + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })} até {new Date(periodEnd + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })} ({daysRemaining === 1 ? 'falta 1 dia' : `faltam ${daysRemaining} dias`})
                    </span>
                  )}
                </div>

                {/* Collapsible Accounts Accordion */}
                <div className="mt-6 border-t border-outline-variant/60 pt-4">
                  <button
                    onClick={() => setIsAccountsExpanded(!isAccountsExpanded)}
                    className="flex items-center justify-between w-full text-brand-primary font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                    id="accounts-accordion-toggle"
                  >
                    <span>Contas</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isAccountsExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isAccountsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3 overflow-hidden font-mono text-xs"
                        id="expanded-accounts-panel"
                      >
                        {budgetAccounts.map(acc => (
                          <div key={acc.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <span className="text-text-muted font-sans font-medium">{acc.name}</span>
                            <span className="text-white font-bold">
                              R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-bg-surface-low border border-outline-variant/60 rounded-xl px-4 py-1.5 focus-within:border-brand-primary transition-all">
                <Search size={16} className="text-text-muted mr-3" />
                <input
                  type="text"
                  placeholder="Buscar no histórico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-0 focus:ring-0 text-text-high w-full p-2 placeholder:text-text-muted focus:outline-none text-xs"
                  id="search-input"
                />
              </div>
            </div>

            {/* Transactions List segmented daily */}
            <div className="space-y-8" id="transactions-grouped-container">
              {groupedTransactions.map((group) => (
                <div key={group.dateLabel} className="space-y-3">
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] border-b border-outline-variant/40 pb-1.5 flex items-center justify-between">
                    <span>{group.dateLabel}</span>
                    <span className={group.dailySum >= 0 ? 'text-green-500' : 'text-text-high'}>
                      {group.dailySum >= 0 ? '+ R$ ' : '- R$ '}
                      {Math.abs(group.dailySum).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </h3>

                  <div className="space-y-2">
                    {group.transactions.map((tx) => {
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-4 bg-bg-surface-low border border-outline-variant/30 hover:border-brand-primary/20 rounded-xl transition-all duration-150 group cursor-pointer"
                          onClick={() => {
                            setEditingTransaction(tx);
                            setIsFormOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div>
                              <h4 className="font-bold text-sm text-text-high group-hover:text-white transition-colors">
                                {tx.description}
                              </h4>
                              <p className="text-xs text-text-muted mt-0.5">
                                {tx.account} • {tx.time}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`font-bold text-sm ${tx.amount >= 0 ? 'text-green-500' : 'text-text-high'}`}>
                                {tx.amount >= 0 ? '+' : '-'} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>

                            {/* Editing/Deleting Micro controls visible in items */}
                            <div className="flex items-center gap-1.5 pl-2 border-l border-white/5 opacity-90 transition-opacity duration-200">
                              <button
                                onClick={(e) => handleEditClick(tx, e)}
                                className="p-2.5 hover:text-brand-primary text-text-muted rounded-lg hover:bg-white/5 transition-all"
                                title="Editar"
                                id={`edit-tx-${tx.id}`}
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteTransaction(tx.id, e)}
                                className="p-2.5 hover:text-red-500 text-text-muted rounded-lg hover:bg-red-500/10 transition-all"
                                title="Excluir"
                                id={`delete-tx-${tx.id}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 bg-bg-surface-low border border-dashed border-outline-variant/40 rounded-xl" id="empty-transactions-state">
                  <p className="text-xs text-text-muted italic">Nenhum lançamento no período.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: CARTÕES (CREDIT CARDS AND BILL DETAILS) */}
        {activeTab === 'cartoes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
            id="tab-cartoes-view"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider font-semibold">Crédito & Cartões</h3>
                <h2 className="text-xl font-display font-black text-white mt-1">Sua carteira de prestígio</h2>
              </div>
              <button
                onClick={(e) => handleAddCard(e)}
                className="bg-brand-primary hover:bg-brand-accent text-black font-bold p-2 text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                id="add-card-launcher"
              >
                <Plus size={14} /> Novo Cartão
              </button>
            </div>

            {/* Main scrollable credit cards list */}
            <div className="space-y-5" id="credit-cards-scroller">
              {cards.map(cardItem => (
                <CardItem
                  key={cardItem.id}
                  card={cardItem}
                  onPayBill={handlePayBill}
                  onAdjustLimit={handleAdjustLimit}
                />
              ))}

              {cards.length === 0 && (
                <p className="text-xs text-text-muted italic text-center py-8">Nenhum cartão cadastrado.</p>
              )}
            </div>

            {/* Billing visual simulation report */}
            <div className="bg-bg-surface-low border border-outline-variant p-5 rounded-2xl space-y-4">
              <h4 className="text-[11px] uppercase tracking-widest text-[#ffe08b] font-bold">Consolidação de Crédito</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-text-muted font-sans font-medium">Faturas Totais em Aberto</span>
                  <span className="text-white font-bold">R$ {cards.reduce((sum, c) => sum + c.used, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-text-muted font-sans font-medium">Limite Global Disponível</span>
                  <span className="text-brand-primary font-bold">R$ {cards.reduce((sum, c) => sum + (c.limit - c.used), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: PERFIL (REAL SETTINGS & ACCOUNT SIMULATIONS) */}
        {activeTab === 'perfil' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
            id="tab-perfil-view"
          >
            {/* Header profile details */}
            <div className="flex items-center gap-4 bg-bg-surface-low border border-outline-variant/60 p-5 rounded-2xl gold-glow">
              <div className="w-14 h-14 rounded-full border border-brand-primary overflow-hidden bg-bg-surface-med shrink-0">
                <img className="w-full h-full object-cover" src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">{user.name}</h3>
                <p className="text-xs text-text-muted">armindo.netto@gmail.com</p>
                <span className="inline-block text-[9px] font-mono tracking-wider font-bold bg-amber-500/10 text-brand-primary border border-yellow-500/30 px-1.5 py-0.5 rounded mt-1.5 uppercase">VIP CLIENT</span>
              </div>
            </div>

            {/* Custom Interactive Simulators Section */}
            <section className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-widest text-[#ffe08b] font-bold">Gastos Mensais por Conta</h4>
              
              <div className="bg-bg-surface-low border border-outline-variant rounded-2xl p-4 space-y-3">
                <p className="text-[11px] text-text-muted pb-2 border-b border-white/5">
                  Ajuste ou acompanhe os gastos acumulados de cada uma das suas contas bancárias neste período (iniciam em zero):
                </p>

                <div className="space-y-3">
                  {budgetAccounts.map(acc => (
                    <div key={acc.id} className="flex items-center justify-between text-xs gap-4">
                      <span className="text-text-mid font-medium min-w-[100px] text-left">{acc.name}</span>
                      <div className="relative flex-1 max-w-[160px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary font-bold text-[10px]">R$</span>
                        <input
                          type="text"
                          value={acc.balance.toString()}
                          onChange={(e) => handleUpdateAccountBalance(acc.id, e.target.value)}
                          className="w-full bg-bg-base border border-outline-variant rounded-lg pl-8 pr-3 py-1.5 text-right font-mono text-white text-xs focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/25 transition-all"
                          id={`account-balance-input-${acc.id}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Goal setter */}
            <div className="bg-bg-surface-low border border-outline-variant p-5 rounded-2xl space-y-3">
              <h4 className="text-[11px] uppercase tracking-widest text-[#ffe08b] font-bold">Meta de Performance</h4>
              <div className="space-y-1 text-xs">
                <label className="block text-text-muted text-[11px] mb-1">Entrada Mensal Alvo (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-[11px]">R$</span>
                  <input
                    type="number"
                    value={user.monthlyIncomeGoal}
                    onChange={(e) => setUser(prev => ({ ...prev, monthlyIncomeGoal: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-bg-base border border-outline-variant rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all text-xs"
                    id="income-goal-input"
                  />
                </div>
              </div>
            </div>

            {/* Utility and reset section */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase tracking-widest text-[#ffe08b] font-bold">Sistema de Inteligência</h4>
              
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={handleResetData}
                  className="w-full bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer inline-block text-center"
                  id="reset-data-launcher"
                >
                  <RotateCcw size={14} /> Restaurar Simulações de Fábrica
                </button>
              </div>

              <div className="text-center pt-2 text-[10px] text-text-muted">
                Versão 1.0.0 • Nocturne
              </div>
            </div>
          </motion.div>
        )}
          </>
        )}

        {/* TAB 2: CONTAS */}
        {activeScreen === 'contas' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
            id="contas-screen-view"
          >
            {/* Header / Summary Card */}
            <div className="bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-5 shadow-lg relative overflow-hidden mb-6" id="contas-summary-header">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-full pointer-events-none" />
              <span className="text-[10px] text-brand-primary uppercase tracking-widest font-mono font-bold block mb-1">
                Ativo Consolidado
              </span>
              <h2 className="text-3xl font-display font-black text-white tracking-tight">
                R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>

            {/* Botão de Cadastrar Nova Conta em popup modal */}
            <button
              type="button"
              onClick={() => {
                setNewAccountName('');
                setNewAccountBalance('');
                setIsNewAccountModalOpen(true);
              }}
              className="w-full bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/35 text-brand-primary font-bold uppercase text-[10px] tracking-widest py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 mb-6"
              id="btn-open-create-account-modal"
            >
              <Plus size={14} strokeWidth={3} /> Cadastrar Nova Conta
            </button>

            {/* List of accounts */}
            <div className="space-y-4" id="contas-managed-list-container">
              <span className="block text-[10px] uppercase tracking-widest text-[#ffe08b] font-bold font-mono">
                Suas Contas Cadastradas
              </span>

              <Reorder.Group axis="y" values={accounts} onReorder={setAccounts} className="space-y-4" id="reorder-accounts-group">
                {accounts.map(acc => (
                  <AccountItem
                    key={acc.id}
                    acc={acc}
                    onEdit={(accToEdit) => {
                      setEditingAccount(accToEdit);
                      setEditAccountName(accToEdit.name);
                      setEditAccountBalance(accToEdit.balance.toFixed(2).replace('.', ','));
                      setEditAccountColor(accToEdit.color || 'brand-primary');
                      setIsEditAccountModalOpen(true);
                    }}
                    onDelete={(accToDelete) => {
                      if (accounts.length <= 1) {
                        triggerToast('Mantenha pelo menos uma conta ativa para operacionalizar o app.');
                        return;
                      }
                      setAccountToDelete(accToDelete);
                    }}
                    onAddBalance={(accToAdd) => {
                      setSelectedAdjustingAccount(accToAdd);
                      setAdjustingType('somar');
                      setAdjustmentAmount('');
                      setIsAdjustBalanceModalOpen(true);
                    }}
                    onSubBalance={(accToSub) => {
                      setSelectedAdjustingAccount(accToSub);
                      setAdjustingType('subtrair');
                      setAdjustmentAmount('');
                      setIsAdjustBalanceModalOpen(true);
                    }}
                  />
                ))}
              </Reorder.Group>
            </div>
          </motion.div>
        )}

        {/* TAB 3: TEMP (INFORMAÇÕES TEMPORÁRIAS) */}
        {activeScreen === 'temp' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
            id="temp-screen-view"
          >
            {/* Header / Summary Card */}
            <div className="bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-5 shadow-lg relative overflow-hidden mb-6" id="temp-summary-header">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-full pointer-events-none" />
              <span className="text-[10px] text-brand-primary uppercase tracking-widest font-mono font-bold block mb-1">
                Controle Temporário Consolidado
              </span>
              <h2 className="text-3xl font-display font-black text-white tracking-tight">
                R$ {tempCategories.reduce((acc, cat) => acc + cat.entries.reduce((eAcc, entry) => eAcc + entry.amount, 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[10px] text-text-muted mt-1 uppercase font-semibold">
                {tempCategories.length} {tempCategories.length === 1 ? 'categoria ativa' : 'categorias ativas'}
              </p>
            </div>

            {/* Botão de Cadastrar Nova Categoria em popup modal */}
            <button
              type="button"
              onClick={() => {
                setNewTempCategoryName('');
                setIsNewTempCategoryModalOpen(true);
              }}
              className="w-full bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/35 text-brand-primary font-bold uppercase text-[10px] tracking-widest py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 mb-6"
              id="btn-open-create-temp-modal"
            >
              <PlusCircle size={14} strokeWidth={3} /> Nova Categoria Temporária
            </button>

            {/* List of temporary categories */}
            <div className="space-y-6" id="temp-managed-list-container">
              {tempCategories.length === 0 ? (
                <div className="text-center py-10 bg-bg-surface-low/30 border border-dashed border-outline-variant/40 rounded-2xl text-text-muted text-xs">
                  <Flame size={20} className="mx-auto mb-2 opacity-50 text-brand-primary" />
                  Nenhuma categoria temporária cadastrada.
                </div>
              ) : (
                tempCategories.map(cat => {
                  const sumOfCategory = cat.entries.reduce((acc, e) => acc + e.amount, 0);
                  return (
                    <div 
                      key={cat.id} 
                      className="bg-bg-surface-low border border-outline-variant/50 rounded-2xl p-4.5 space-y-3 relative transition-all hover:border-outline-variant"
                      id={`card-temp-${cat.id}`}
                    >
                      {/* Header row with Name and trash button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-sm shadow-brand-primary/50" />
                          <span className="text-xs font-black text-white uppercase tracking-wider">{cat.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTempCategory(cat.id, cat.name)}
                          className="text-text-muted hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center"
                          title="Remover categoria"
                          id={`btn-delete-temp-${cat.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Entries List */}
                      <div className="space-y-2 mt-1">
                        {cat.entries.length === 0 ? (
                          <p className="text-[11px] text-text-muted italic opacity-70">Nenhum lançamento nesta categoria.</p>
                        ) : (
                          <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                            {cat.entries.map(entry => (
                              <div 
                                key={entry.id} 
                                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-bg-base/40 border border-outline-variant/20 hover:border-outline-variant/40 transition-all"
                                id={`entry-row-${entry.id}`}
                              >
                                <div className="flex flex-col">
                                  <span className="text-white font-medium text-[11px]">{entry.description}</span>
                                  <span className="text-[9px] text-text-muted">{entry.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-white text-[11px]">
                                    R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTempEntry(cat.id, entry.id)}
                                    className="text-text-muted hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
                                    title="Excluir lançamento"
                                    id={`btn-delete-entry-${entry.id}`}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Somatório field */}
                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Somatório</span>
                        <span className="text-sm font-extrabold font-mono text-[#ffe08b]">
                          R$ {sumOfCategory.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Add Lançamento form */}
                      <div className="bg-bg-base/30 border border-outline-variant/30 rounded-xl p-2.5 mt-3 space-y-2">
                        <span className="block text-[9px] uppercase tracking-widest text-brand-primary font-black">Adicionar Lançamento</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Descrição"
                            value={newEntryDesc[cat.id] || ''}
                            onChange={(e) => setNewEntryDesc(prev => ({ ...prev, [cat.id]: e.target.value }))}
                            className="flex-1 bg-bg-base border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all"
                            id={`input-desc-temp-${cat.id}`}
                          />
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0,00"
                            value={newEntryAmount[cat.id] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const digits = val.replace(/\D/g, '');
                              if (!digits) {
                                setNewEntryAmount(prev => ({ ...prev, [cat.id]: '' }));
                                return;
                              }
                              if (digits.length < 3) {
                                const parsedNum = parseInt(digits, 10);
                                setNewEntryAmount(prev => ({ ...prev, [cat.id]: isNaN(parsedNum) ? '' : String(parsedNum) }));
                              } else {
                                const cents = digits.slice(-2);
                                const whole = digits.slice(0, -2);
                                const parsedWhole = parseInt(whole, 10);
                                const formattedWhole = isNaN(parsedWhole) ? '0' : String(parsedWhole);
                                setNewEntryAmount(prev => ({ ...prev, [cat.id]: `${formattedWhole},${cents}` }));
                              }
                            }}
                            className="w-20 bg-bg-base border border-outline-variant/40 rounded-lg px-2 py-1.5 text-[11px] text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all text-center font-mono"
                            id={`input-val-temp-${cat.id}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTempEntry(cat.id, newEntryDesc[cat.id] || '', newEntryAmount[cat.id] || '')}
                            className="bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-black py-1 px-3 border border-brand-primary/30 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center shrink-0"
                            id={`btn-add-entry-${cat.id}`}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        </div>

        {/* Discrete footer for applet authoring */}
        <div className="text-center pb-4 pt-4 text-[10px] text-text-muted select-none opacity-60 tracking-wider shrink-0" id="app-developer-footer">
          2026 - v1.0.0 - Desenvolvido por Armindo Neto.
        </div>
      </main>

      {/* Fixed bottom menu bar with active dynamic states */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-outline-variant/30 px-6 py-3.5 flex items-center justify-around md:rounded-b-[24px]" 
        id="bottom-menu-bar"
      >
        <button
          type="button"
          onClick={() => setActiveScreen('budget')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all ${activeScreen === 'budget' ? 'text-brand-primary' : 'text-text-muted hover:text-white'}`}
          id="btn-nav-budget"
        >
          <Wallet size={18} className={activeScreen === 'budget' ? 'scale-110 text-brand-primary transition-transform' : 'transition-transform'} />
          <span className="text-[10px] font-black tracking-widest uppercase font-display">BUDGET</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveScreen('contas')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all ${activeScreen === 'contas' ? 'text-brand-primary' : 'text-text-muted hover:text-white'}`}
          id="btn-nav-contas"
        >
          <Landmark size={18} className={activeScreen === 'contas' ? 'scale-110 text-brand-primary transition-transform' : 'transition-transform'} />
          <span className="text-[10px] font-black tracking-widest uppercase font-display">CONTAS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveScreen('temp')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all ${activeScreen === 'temp' ? 'text-brand-primary' : 'text-text-muted hover:text-white'}`}
          id="btn-nav-temp"
        >
          <Clock size={18} className={activeScreen === 'temp' ? 'scale-110 text-brand-primary transition-transform' : 'transition-transform'} />
          <span className="text-[10px] font-black tracking-widest uppercase font-display">TEMP</span>
        </button>
      </div>

      {/* FAB (Floating Action Button): Visible only on BUDGET screen */}
      <AnimatePresence>
        {activeScreen === 'budget' && (
          <motion.button
            key="add-fab-button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
            className="absolute bottom-20 right-6 w-14 h-14 bg-brand-primary text-black rounded-full flex items-center justify-center shadow-2xl hover:brightness-110 z-30 cursor-pointer gold-glow ring-2 ring-brand-primary/20"
            title="Novo lançamento"
            id="global-add-fab-btn"
          >
            <Plus size={28} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stateful Transaction Input & Editor Modal Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialTransaction={editingTransaction}
      />

      {/* Modal para Novo Período de Despesas */}
      <AnimatePresence>
        {isPeriodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="period-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-xl text-left"
              id="period-modal-content"
            >
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <Calendar className="text-brand-primary" size={18} />
                <h3 className="font-display font-black text-sm tracking-tight text-white uppercase">
                  Iniciar Novo Período
                </h3>
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed">
                Esta ação irá <strong className="text-white font-semibold">apagar definitivamente todos os lançamentos</strong> de despesa/receita anteriores e reconfigurar o saldo das contas para o total definido para o novo período.
              </p>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold">
                    Saldo Total do Período (R$)
                  </label>
                  <input
                    type="number"
                    value={modalPeriodTotal}
                    onChange={(e) => setModalPeriodTotal(e.target.value)}
                    className="w-full bg-bg-base border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-text-high font-mono tracking-tight focus:outline-none focus:border-brand-primary transition-all"
                    placeholder="Ex: 5000.00"
                    min="1"
                    step="0.01"
                    id="period-total-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={modalPeriodStart}
                      onChange={(e) => setModalPeriodStart(e.target.value)}
                      className="w-full bg-bg-base border border-outline-variant rounded-xl px-3 py-2 text-xs text-text-high focus:outline-none focus:border-brand-primary transition-all"
                      id="period-start-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold">
                      Data de Término
                    </label>
                    <input
                      type="date"
                      value={modalPeriodEnd}
                      onChange={(e) => setModalPeriodEnd(e.target.value)}
                      className="w-full bg-bg-base border border-outline-variant rounded-xl px-3 py-2 text-xs text-text-high focus:outline-none focus:border-brand-primary transition-all"
                      id="period-end-input"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPeriodModalOpen(false)}
                  className="flex-1 border border-outline-variant/60 hover:bg-white/5 text-text-muted font-bold uppercase text-[10px] tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                  id="period-cancel-btn"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const totalVal = parseFloat(modalPeriodTotal);
                    if (isNaN(totalVal) || totalVal <= 0) {
                      alert('Por favor, defina um saldo total válido maior que zero.');
                      return;
                    }
                    if (!modalPeriodStart || !modalPeriodEnd) {
                      alert('Por favor, selecione as datas de início e término.');
                      return;
                    }
                    if (new Date(modalPeriodEnd) < new Date(modalPeriodStart)) {
                      alert('A data de término não pode ser anterior à data de início.');
                      return;
                    }
                    
                    // Proceed to set and launch
                    handleConfirmNewPeriod(modalPeriodStart, modalPeriodEnd, totalVal);
                    setIsPeriodModalOpen(false);
                  }}
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/80 text-black font-extrabold uppercase text-[10px] tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                  id="period-confirm-btn"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Cadastrar Nova Conta */}
      <AnimatePresence>
        {isNewAccountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm shadow-2xl" id="new-account-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-xl text-left"
              id="new-account-modal-content"
            >
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <Landmark className="text-[#ffe08b]" size={18} />
                <h3 className="font-display font-black text-sm tracking-tight text-white uppercase">
                  Cadastrar Nova Conta
                </h3>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] text-text-muted">Nome da Conta</label>
                  <input
                    type="text"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="Ex: Inter, Itaú, XP"
                    className="w-full bg-bg-base border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-text-high font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/25 transition-all"
                    id="modal-new-account-name-input"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-text-muted">Saldo Inicial (R$)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newAccountBalance}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, '');
                      if (!digits) {
                        setNewAccountBalance('');
                        return;
                      }
                      if (digits.length < 3) {
                        const parsedNum = parseInt(digits, 10);
                        setNewAccountBalance(isNaN(parsedNum) ? '' : String(parsedNum));
                      } else {
                        const cents = digits.slice(-2);
                        const whole = digits.slice(0, -2);
                        const parsedWhole = parseInt(whole, 10);
                        const formattedWhole = isNaN(parsedWhole) ? '0' : String(parsedWhole);
                        setNewAccountBalance(`${formattedWhole},${cents}`);
                      }
                    }}
                    placeholder="0,00"
                    className="w-full bg-bg-base border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-text-high font-mono tracking-tight focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/25 transition-all"
                    id="modal-new-account-balance-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] text-text-muted uppercase tracking-wider font-semibold">Cor do Ícone</label>
                  <div className="flex items-center gap-2.5 py-1">
                    {ACCOUNT_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setNewAccountColor(c.value)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border border-outline-variant/30 ${
                          newAccountColor === c.value
                            ? 'ring-2 ring-brand-primary/50 bg-zinc-900 border-zinc-700 scale-110'
                            : 'bg-zinc-950 hover:bg-zinc-900 hover:scale-105'
                        }`}
                        title={c.label}
                        id={`btn-color-select-new-${c.value}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${getAccountColorClasses(c.value)}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewAccountModalOpen(false);
                      setNewAccountName('');
                      setNewAccountBalance('');
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-text-high font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                    id="btn-cancel-new-account"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary/80 text-black font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 font-display"
                    id="btn-confirm-new-account"
                  >
                    Criar Conta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Cadastrar Nova Categoria Temporária */}
      <AnimatePresence>
        {isNewTempCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm shadow-2xl" id="new-temp-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-xl text-left"
              id="new-temp-modal-content"
            >
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <Clock className="text-[#ffe08b]" size={18} />
                <h3 className="font-display font-black text-sm tracking-tight text-white uppercase">
                  Nova Categoria Temporária
                </h3>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newTempCategoryName.trim()) {
                  triggerToast('Por favor, digite um nome para a categoria.');
                  return;
                }
                handleCreateTempCategory(newTempCategoryName);
                setIsNewTempCategoryModalOpen(false);
                setNewTempCategoryName('');
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] text-text-muted font-semibold uppercase tracking-wider">Nome da Categoria</label>
                  <input
                    type="text"
                    value={newTempCategoryName}
                    onChange={(e) => setNewTempCategoryName(e.target.value)}
                    placeholder="Ex: Viagem Paraty, Compras de Natal"
                    className="w-full bg-bg-base border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-text-high font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/25 transition-all"
                    id="modal-new-temp-category-name-input"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewTempCategoryModalOpen(false);
                      setNewTempCategoryName('');
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-text-high font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                    id="btn-cancel-new-temp-category"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary/80 text-black font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 font-display"
                    id="btn-confirm-new-temp-category"
                  >
                    Criar Categoria
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Editar Conta */}
      <AnimatePresence>
        {isEditAccountModalOpen && editingAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm shadow-2xl" id="edit-account-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-xl text-left"
              id="edit-account-modal-content"
            >
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <Edit3 className="text-[#ffe08b]" size={18} />
                <h3 className="font-display font-black text-sm tracking-tight text-white uppercase">
                  Editar Conta
                </h3>
              </div>

              <form onSubmit={handleEditAccountSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] text-text-muted">Nome da Conta</label>
                  <input
                    type="text"
                    value={editAccountName}
                    onChange={(e) => setEditAccountName(e.target.value)}
                    placeholder="Ex: Inter, Itaú, XP"
                    className="w-full bg-bg-base border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-text-high font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/25 transition-all"
                    id="modal-edit-account-name-input"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-text-muted">Saldo Atual (R$)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editAccountBalance}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, '');
                      if (!digits) {
                        setEditAccountBalance('');
                        return;
                      }
                      if (digits.length < 3) {
                        const parsedNum = parseInt(digits, 10);
                        setEditAccountBalance(isNaN(parsedNum) ? '' : String(parsedNum));
                      } else {
                        const cents = digits.slice(-2);
                        const whole = digits.slice(0, -2);
                        const parsedWhole = parseInt(whole, 10);
                        const formattedWhole = isNaN(parsedWhole) ? '0' : String(parsedWhole);
                        setEditAccountBalance(`${formattedWhole},${cents}`);
                      }
                    }}
                    placeholder="0,00"
                    className="w-full bg-bg-base border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-text-high font-mono tracking-tight focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/25 transition-all"
                    id="modal-edit-account-balance-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] text-text-muted uppercase tracking-wider font-semibold">Cor do Ícone</label>
                  <div className="flex items-center gap-2.5 py-1">
                    {ACCOUNT_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setEditAccountColor(c.value)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border border-outline-variant/30 ${
                          editAccountColor === c.value
                            ? 'ring-2 ring-brand-primary/50 bg-zinc-900 border-zinc-700 scale-110'
                            : 'bg-zinc-950 hover:bg-zinc-900 hover:scale-105'
                        }`}
                        title={c.label}
                        id={`btn-color-select-edit-${c.value}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${getAccountColorClasses(c.value)}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditAccountModalOpen(false);
                      setEditingAccount(null);
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-text-high font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                    id="btn-cancel-edit-account"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary/80 text-black font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 font-display"
                    id="btn-confirm-edit-account"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Confirmação de Exclusão de Conta */}
      <AnimatePresence>
        {accountToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm shadow-2xl" id="delete-account-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-xl text-left"
              id="delete-account-modal-content"
            >
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3 text-red-400">
                <Trash2 size={18} />
                <h3 className="font-display font-black text-sm tracking-tight uppercase">
                  Excluir Conta
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-text-high leading-relaxed">
                  Tem certeza que deseja remover a conta <strong className="text-[#ffe08b]">"{accountToDelete.name}"</strong>?
                </p>
                <p className="text-red-400/90 leading-relaxed font-mono text-[10px]">
                  * Esta ação irá reajustar o seu ativo consolidado. Os lançamentos vinculados a esta conta não serão removidos, mas a conta em si deixará de existir no sistema.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAccountToDelete(null)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-text-high font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                  id="btn-cancel-delete"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteAccount(accountToDelete.id, accountToDelete.name);
                    setAccountToDelete(null);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                  id="btn-confirm-delete"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Ajuste Rápido de Saldo */}
      <AnimatePresence>
        {isAdjustBalanceModalOpen && selectedAdjustingAccount && adjustingType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm shadow-2xl" id="adjust-balance-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-xl text-left"
              id="adjust-balance-modal-content"
            >
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                {adjustingType === 'somar' ? (
                  <ArrowUpRight className="text-emerald-400" size={18} />
                ) : (
                  <ArrowDownLeft className="text-red-400" size={18} />
                )}
                <h3 className="font-display font-black text-sm tracking-tight text-white uppercase">
                  {adjustingType === 'somar' ? 'Somar ao Saldo' : 'Subtrair do Saldo'}
                </h3>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold font-mono">Conta Selecionada</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">{selectedAdjustingAccount.name}</span>
                <p className="text-xs text-text-muted">
                  Saldo atual: <span className="font-mono text-white font-semibold">R$ {selectedAdjustingAccount.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </p>
              </div>

              <form onSubmit={handleAdjustBalanceSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-text-muted">
                    Valor a {adjustingType === 'somar' ? 'somar' : 'subtrair'} (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xs">R$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={adjustmentAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        const digits = val.replace(/\D/g, '');
                        if (!digits) {
                          setAdjustmentAmount('');
                          return;
                        }
                        if (digits.length < 3) {
                          const parsedNum = parseInt(digits, 10);
                          setAdjustmentAmount(isNaN(parsedNum) ? '' : String(parsedNum));
                        } else {
                          const cents = digits.slice(-2);
                          const whole = digits.slice(0, -2);
                          const parsedWhole = parseInt(whole, 10);
                          const formattedWhole = isNaN(parsedWhole) ? '0' : String(parsedWhole);
                          setAdjustmentAmount(`${formattedWhole},${cents}`);
                        }
                      }}
                      className="w-full bg-bg-base border border-outline-variant rounded-xl pl-8 pr-3 py-2.5 font-mono text-white text-xs focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/25 transition-all placeholder:text-text-muted/40"
                      id="modal-adjust-amount-input"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdjustBalanceModalOpen(false);
                      setSelectedAdjustingAccount(null);
                      setAdjustingType(null);
                      setAdjustmentAmount('');
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-text-high font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                    id="btn-cancel-adjust"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${adjustingType === 'somar' ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-red-500 hover:bg-red-400 text-white'}`}
                    id="btn-confirm-adjust"
                  >
                    {adjustingType === 'somar' ? 'Somar' : 'Subtrair'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Análise de Saldo e Projeções */}
      <AnimatePresence>
        {isAnalysisModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" id="analysis-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-bg-surface-low border border-outline-variant/60 rounded-2xl p-6 flex flex-col max-h-[85vh] shadow-2xl relative text-left"
              id="analysis-modal-content"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <TrendingUp className="text-amber-500" size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs tracking-wider text-white uppercase">
                      Análise de Saldo Geral
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold font-mono">
                      Controle Diário Integrado
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnalysisModalOpen(false)}
                  className="text-text-muted hover:text-white transition-colors cursor-pointer p-1 text-xs"
                >
                  ✕
                </button>
              </div>

              {!periodActive ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <span className="text-4xl">📊</span>
                  <h4 className="text-sm font-bold text-white">Nenhum período ativo</h4>
                  <p className="text-xs text-text-muted max-w-[280px]">
                    Inicie um período de orçamento primeiro para acompanhar a evolução diária e projeções.
                  </p>
                </div>
              ) : (
                <>
                  {/* Projections Key Card - The Most Important Metric */}
                  <div className="bg-black/40 rounded-xl border border-outline-variant/30 p-4 mb-4" id="analysis-projection-card">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Balanço Projetado:</span>
                      <span className={`text-xl font-black font-display tracking-tight ${analysisData.projectedBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        R$ {analysisData.projectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Breakdown micro metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5 font-mono text-[9px] text-text-muted">
                      <div>
                        Média de Despesa Diária:{' '}
                        <strong className="text-white font-bold">R$ {analysisData.averageDailyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="text-right">
                        Total de Despesas Reais:{' '}
                        <strong className="text-white font-bold">R$ {analysisData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de barras simples com Recharts */}
                  <div className="bg-black/40 rounded-xl border border-outline-variant/30 p-3 mb-4" id="analysis-chart-card">
                    <span className="block text-[9px] uppercase tracking-widest text-[#ffe08b] font-bold mb-3 font-mono">
                      Evolução do Limite Atribuído (R$)
                    </span>
                    <div className="w-full h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#71717a" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={6}
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(val) => `${val}`}
                            tickMargin={6}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#111318', 
                              borderColor: '#2d3139', 
                              borderRadius: '8px',
                              fontSize: '10px',
                              color: '#ffffff'
                            }} 
                            labelClassName="text-text-muted"
                            formatter={(value: any) => [`R$ ${value}`, 'Limite']}
                          />
                          <Bar dataKey="Limite Atribuído" fill="#ffe08b" radius={[4, 4, 0, 0]} barSize={16} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Daily list header */}
                  <h4 className="text-[10px] uppercase tracking-widest text-[#ffe08b] font-bold mb-2">
                    Evolução Diária do Período
                  </h4>

                  {/* Scrollable list content */}
                  <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-2 custom-scrollbar max-h-[30vh]">
                    {analysisData.daysList.length === 0 ? (
                      <div className="text-center py-6 text-text-muted text-xs">Nenhum dia decorrido no período atual.</div>
                    ) : (
                      analysisData.daysList.map((day) => {
                        const isPositive = day.dailyNetBalance >= 0;
                        return (
                          <div 
                            key={day.dayNumber} 
                            className="bg-bg-surface-low border border-outline-variant/30 hover:border-outline-variant/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary font-mono bg-brand-primary/10 border border-brand-primary/25 rounded px-1.5 py-0.5">
                                  Dia {day.dayNumber}
                                </span>
                                <span className="text-[10px] text-text-muted font-mono">{day.dateFormatted}</span>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-text-muted font-mono">
                                <div>
                                  Lim. Atribuído:{' '}
                                  <strong className="text-white font-semibold">R$ {day.dailySaldoAtStart.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div>
                                  Despesas Reais:{' '}
                                  <strong className="text-white font-semibold">R$ {day.dayExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex sm:flex-col items-center justify-between sm:justify-center gap-1 border-t sm:border-t-0 border-white/5 pt-1.5 sm:pt-0">
                              <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold font-mono sm:hidden">
                                Balanço:
                              </span>
                              <span className={`font-mono font-black tracking-tight text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isPositive ? '+' : ''} R$ {day.dailyNetBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}

              {/* Footer close */}
              <div className="border-t border-outline-variant/30 pt-4 mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAnalysisModalOpen(false)}
                  className="bg-brand-primary hover:bg-brand-primary/80 border border-brand-primary text-black font-extrabold uppercase text-[10px] tracking-wider px-6 py-2 rounded-xl transition-all cursor-pointer"
                  id="analysis-close-btn"
                >
                  FECHAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
