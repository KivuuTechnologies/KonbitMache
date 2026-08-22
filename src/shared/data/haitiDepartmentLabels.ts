/**
 * Maps Haiti department DB values (French) to their Haitian Creole display names
 * The DB stores French names (e.g. 'Ouest', 'Nord-Est') to match the official
 * Haitian government enum — these keys must NOT be changed
 * The values are the correct Kreyòl Ayisyen spellings shown in the UI
 */
export const DEPARTMENT_CREOLE_LABELS: Record<string, string> = {
  'Artibonite':  'Atibonit',
  'Centre':      'Sant',
  "Grand'Anse":  'Grandans',
  'Nippes':      'Nip',
  'Nord':        'Nò',
  'Nord-Est':    'Nòdès',
  'Nord-Ouest':  'Nòdwès',
  'Ouest':       'Lwès',
  'Sud':         'Sid',
  'Sud-Est':     'Sidès',
};

/**
 * Returns the Kreyòl display label for a department DB value
 * Falls back to the original value if not found
 */
export function getDepartmentLabel(department: string): string {
  return DEPARTMENT_CREOLE_LABELS[department] ?? department;
}
