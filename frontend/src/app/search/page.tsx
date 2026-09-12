import { PreferenceForm } from '@/components/preference-form';

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="space-y-1.5 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Set Job & Internship Criteria</h1>
        <p className="text-sm text-slate-300 font-medium">
          Configure your preferences. Our autonomous agent will discover listings and actively research missing parameters before scoring and ranking.
        </p>
      </div>

      <PreferenceForm />
    </div>
  );
}
