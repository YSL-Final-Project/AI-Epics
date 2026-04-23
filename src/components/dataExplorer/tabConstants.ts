export const TAB_KEYS = ['adoption', 'stackoverflow', 'codegen', 'salary'] as const;
export type TabKey = typeof TAB_KEYS[number];

export const TAB_ACCENTS: Record<TabKey, string> = {
  adoption: '#06b6d4',
  stackoverflow: '#e11d48',
  codegen: '#8b5cf6',
  salary: '#10b981',
};

export function isTabKey(k: string): k is TabKey {
  return (TAB_KEYS as readonly string[]).includes(k);
}
