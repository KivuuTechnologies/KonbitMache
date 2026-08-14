import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export function AuthInput({ id, label, registration, error, ...props }: AuthInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-foreground">{label}</label>
      <input
        id={id}
        {...registration}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="min-h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-base text-foreground outline-none transition focus:border-dlo focus:ring-4 focus:ring-dlo/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/20 dark:bg-[#171413]"
      />
      {error ? <p id={errorId} className="mt-1 text-sm font-semibold text-danger" role="alert">{error}</p> : null}
    </div>
  );
}
