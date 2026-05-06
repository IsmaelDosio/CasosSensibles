import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Case } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';
import { uid } from '@/lib/id';

interface CasesState {
  cases: Case[];
  add: (input: Omit<Case, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'>, user: string) => Case;
  update: (id: string, patch: Partial<Omit<Case, 'id' | 'createdAt' | 'createdBy'>>, user: string) => void;
  softDelete: (id: string, user: string) => void;
  restore: (id: string, user: string) => void;
}

export const useCasesStore = create<CasesState>()(
  persist(
    (set) => ({
      cases: [],
      add: (input, user) => {
        const now = new Date().toISOString();
        const c: Case = {
          ...input,
          id: uid('c'),
          createdAt: now,
          createdBy: user,
          updatedAt: now,
          updatedBy: user,
          deletedAt: null,
          deletedBy: null,
        };
        set((s) => ({ cases: [c, ...s.cases] }));
        return c;
      },
      update: (id, patch, user) => {
        set((s) => ({
          cases: s.cases.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString(), updatedBy: user } : c,
          ),
        }));
      },
      softDelete: (id, user) => {
        set((s) => ({
          cases: s.cases.map((c) =>
            c.id === id
              ? { ...c, deletedAt: new Date().toISOString(), deletedBy: user, updatedAt: new Date().toISOString(), updatedBy: user }
              : c,
          ),
        }));
      },
      restore: (id, user) => {
        set((s) => ({
          cases: s.cases.map((c) =>
            c.id === id
              ? { ...c, deletedAt: null, deletedBy: null, updatedAt: new Date().toISOString(), updatedBy: user }
              : c,
          ),
        }));
      },
    }),
    { name: STORAGE_KEYS.cases, version: 1 },
  ),
);

export const selectActiveCases = (s: CasesState) => s.cases.filter((c) => !c.deletedAt);
export const selectDeletedCases = (s: CasesState) => s.cases.filter((c) => c.deletedAt);
export const selectCaseById = (id: string | null) => (s: CasesState) =>
  id ? s.cases.find((c) => c.id === id) ?? null : null;
