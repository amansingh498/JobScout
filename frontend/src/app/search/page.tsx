import { PreferenceForm } from '@/components/preference-form';

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Set Job & Internship Criteria</h1>
        <p className="text-sm text-slate-400">
          Configure your preferences. Our autonomous agent will discover listings and research missing data before ranking.
        </p>
      </div>

      <PreferenceForm />
    </div>
  );
}
