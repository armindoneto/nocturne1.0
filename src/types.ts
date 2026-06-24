/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  description: string;
  amount: number; // Positive for incoming (depósitos), Negative for outgoing (despesas)
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  account: string; // e.g. "Nubank", "Aeternum", "Itaú Personnalité"
  category: string; // e.g. "Alimentação", "Depósito", "Transporte", "Lazer", "Assinaturas", "Saúde", "Outros"
  status: 'processado' | 'pendente' | 'cancelado';
}

export interface CreditCard {
  id: string;
  brand: string; // e.g. "Aeternum Card", "Nubank Gold"
  holder: string;
  lastFour: string;
  expiry: string;
  limit: number;
  used: number;
  colorTheme: 'gold' | 'purple' | 'slate' | 'emerald';
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  color?: string; // Suffix/value of customizeable dot color
}

export interface TempEntry {
  id: string;
  description: string;
  amount: number; // For simplicity, positive values (or negative as chosen by user)
  date: string;
}

export interface TempCategory {
  id: string;
  name: string;
  entries: TempEntry[];
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  monthlyIncomeGoal: number;
  customMainAccount: string;
}

export interface PatrimonyEntry {
  id: string;
  monthYear: string; // e.g. "05/2026"
  amount: number;
}

export interface PlanCard {
  id: string;
  name: string;
  excludedMonths?: string[]; // "YYYY-MM" where this card has been removed
  months?: string[]; // "YYYY-MM" months where this card is active
}

export interface PlanEntry {
  id: string;
  name: string;
  amount: number;
  month: string; // "YYYY-MM"
  category: 'gastos' | 'cartoes' | 'contas';
  cardId?: string; // only if category === 'cartoes'
  accountId?: string; // only if category === 'contas'
  subcategory: string; // 'CASA' | 'FIXOS' | 'GERAL' for 'gastos', or 'PARCELAS' | 'FIXOS' | 'GERAL' for 'cartoes', or account name/id for 'contas'
  type?: 'expense' | 'income'; // 'expense' by default, or 'income' for revenue
  isInstallment?: boolean;
  installmentsCount?: number;
  currentInstallment?: number;
}

export type ActiveTab = 'inicio' | 'transacoes' | 'cartoes' | 'perfil';

export interface PlanScreenProps {
  planEntries: PlanEntry[];
  setPlanEntries: (value: PlanEntry[] | ((prev: PlanEntry[]) => PlanEntry[])) => void;
  planIncomes: { [month: string]: number };
  setPlanIncomes: (value: { [month: string]: number } | ((prev: { [month: string]: number }) => { [month: string]: number })) => void;
  planCards: PlanCard[];
  setPlanCards: (value: PlanCard[] | ((prev: PlanCard[]) => PlanCard[])) => void;
  triggerToast: (msg: string) => void;
  accounts: Account[];
}

