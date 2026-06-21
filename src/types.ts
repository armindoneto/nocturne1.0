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

export type ActiveTab = 'inicio' | 'transacoes' | 'cartoes' | 'perfil';
