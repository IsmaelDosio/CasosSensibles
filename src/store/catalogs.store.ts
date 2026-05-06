import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CatalogKey, CatalogValue } from '@/types';
import { LOCKED_CATALOGS } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';
import { uid } from '@/lib/id';

interface CatalogsState {
  values: CatalogValue[];
  addValue: (catalog: CatalogKey, value: string) => void;
  updateValue: (id: string, value: string) => void;
  setActive: (id: string, active: boolean) => void;
}

export const isLocked = (catalog: CatalogKey) => LOCKED_CATALOGS.includes(catalog);

export const useCatalogsStore = create<CatalogsState>()(
  persist(
    (set) => ({
      values: [],
      addValue: (catalog, value) => {
        if (isLocked(catalog)) return;
        const trimmed = value.trim();
        if (!trimmed) return;
        set((s) => {
          if (s.values.some((v) => v.catalog === catalog && v.value.toUpperCase() === trimmed.toUpperCase())) {
            return s;
          }
          return {
            values: [...s.values, { id: uid('cv'), catalog, value: trimmed, active: true }],
          };
        });
      },
      updateValue: (id, value) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        set((s) => ({
          values: s.values.map((v) => {
            if (v.id !== id) return v;
            if (isLocked(v.catalog)) return v;
            return { ...v, value: trimmed };
          }),
        }));
      },
      setActive: (id, active) => {
        set((s) => ({
          values: s.values.map((v) => {
            if (v.id !== id) return v;
            if (isLocked(v.catalog)) return v;
            return { ...v, active };
          }),
        }));
      },
    }),
    { name: STORAGE_KEYS.catalogs, version: 1 },
  ),
);

export const selectByCatalog = (catalog: CatalogKey) => (s: CatalogsState) =>
  s.values.filter((v) => v.catalog === catalog);

export const selectActiveByCatalog = (catalog: CatalogKey) => (s: CatalogsState) =>
  s.values.filter((v) => v.catalog === catalog && v.active);
