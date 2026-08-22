'use client';

import { useTranslations } from '@/shared/i18n/useTranslations';
import { getDepartmentLabel } from '@/shared/data/haitiDepartmentLabels';
import { HAITI_DEPARTMENTS, HAITI_LOCATIONS } from '../data/haitiLocations';

interface OnboardingStep2Props {
  department: string;
  commune: string;
  onChangeDepartment: (dept: string) => void;
  onChangeCommune: (commune: string) => void;
  errorDepartment?: string;
  errorCommune?: string;
}

export function OnboardingStep2({
  department,
  commune,
  onChangeDepartment,
  onChangeCommune,
  errorDepartment,
  errorCommune,
}: OnboardingStep2Props) {
  const t = useTranslations();

  const availableCommunes = department ? HAITI_LOCATIONS[department] || [] : [];

  const handleDepartmentChange = (newDept: string) => {
    onChangeDepartment(newDept);
    // Reset commune when department changes
    onChangeCommune('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          {t.seller.onboarding.step2.title}
        </h2>
        <p className="mt-2 text-base text-foreground/75 sm:text-lg">
          {t.seller.onboarding.step2.subtitle}
        </p>
      </div>

      <div className="space-y-5">
        {/* Department Select */}
        <div>
          <label htmlFor="department" className="block text-lg font-bold text-foreground">
            {t.seller.onboarding.step2.departmentLabel} *
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="mt-2 w-full min-h-14 rounded-xl border-2 border-black/10 bg-surface px-4 text-lg font-medium text-foreground outline-none transition focus:border-te focus:ring-4 focus:ring-te/20"
          >
            <option value="">{t.seller.onboarding.step2.departmentPlaceholder}</option>
            {HAITI_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {getDepartmentLabel(dept)}
              </option>
            ))}
          </select>
          {errorDepartment && (
            <p className="mt-1 text-base font-semibold text-red-600">{errorDepartment}</p>
          )}
        </div>

        {/* Commune Select */}
        <div>
          <label htmlFor="commune" className="block text-lg font-bold text-foreground">
            {t.seller.onboarding.step2.communeLabel} *
          </label>
          <select
            id="commune"
            value={commune}
            onChange={(e) => onChangeCommune(e.target.value)}
            disabled={!department}
            className="mt-2 w-full min-h-14 rounded-xl border-2 border-black/10 bg-surface px-4 text-lg font-medium text-foreground outline-none transition focus:border-te focus:ring-4 focus:ring-te/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60"
          >
            <option value="">{t.seller.onboarding.step2.communePlaceholder}</option>
            {availableCommunes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errorCommune && (
            <p className="mt-1 text-base font-semibold text-red-600">{errorCommune}</p>
          )}
        </div>
      </div>
    </div>
  );
}
