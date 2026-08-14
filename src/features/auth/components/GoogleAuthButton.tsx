import { LogIn } from 'lucide-react';

interface GoogleAuthButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export function GoogleAuthButton({ label, disabled, onClick }: GoogleAuthButtonProps) {
  return <button type="button" disabled={disabled} onClick={onClick} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-black/15 px-4 text-base font-bold text-foreground transition hover:bg-black/5 focus:outline-none focus:ring-4 focus:ring-dlo/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/20 dark:hover:bg-white/10"><LogIn className="h-5 w-5" aria-hidden="true" />{label}</button>;
}
