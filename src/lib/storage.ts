export const STORAGE_KEYS = {
  cases: 'scm.cases.v1',
  catalogs: 'scm.catalogs.v1',
  auth: 'scm.auth.v1',
  seeded: 'scm.seeded.v1',
} as const;

export function clearDemoData() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}
