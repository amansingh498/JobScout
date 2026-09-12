'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPreferences } from '@/types/job';
import { createSearch } from '@/lib/api';
import { Sparkles, Plus, X, Search, DollarSign, MapPin, Briefcase, Code } from 'lucide-react';

export function PreferenceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [targetRoles, setTargetRoles] = useState<string[]>(['Software Engineering Intern']);
  const [roleInput, setRoleInput] = useState('');

  const [skills, setSkills] = useState<string[]>(['Python', 'React', 'TypeScript']);
  const [skillInput, setSkillInput] = useState('');

  const [locations, setLocations] = useState<string[]>(['Bangalore', 'Remote']);
  const [locationInput, setLocationInput] = useState('');

  const [minStipend, setMinStipend] = useState<number | ''>(50000);
  const [minSalary, setMinSalary] = useState<number | ''>('');
  const [employmentType, setEmploymentType] = useState('Internship');
  const [remoteAllowed, setRemoteAllowed] = useState(true);

  const addTag = (
    input: string, 
    setInput: React.Dispatch<React.SetStateAction<string>>, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (!input.trim()) return;
    if (!list.includes(input.trim())) {
      setList([...list, input.trim()]);
    }
    setInput('');
  };

  const removeTag = (tag: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const prefs: UserPreferences = {
      target_roles: targetRoles.length > 0 ? targetRoles : (roleInput ? [roleInput] : ['Software Engineer']),
      min_stipend: minStipend === '' ? null : Number(minStipend),
      min_salary: minSalary === '' ? null : Number(minSalary),
      preferred_locations: locations,
      remote_allowed: remoteAllowed,
      skills: skills,
      employment_type: employmentType,
    };

    try {
      const response = await createSearch(prefs);
      router.push(`/processing/${response.search_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch agent search');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Target Roles */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" /> Target Roles & Keywords
        </label>
        <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus-within:border-blue-500 transition-colors">
          {targetRoles.map((role) => (
            <span key={role} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
              {role}
              <button type="button" onClick={() => removeTag(role, targetRoles, setTargetRoles)} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Type role & press Enter..."
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(roleInput, setRoleInput, targetRoles, setTargetRoles);
              }
            }}
            className="bg-transparent text-sm focus:outline-none flex-1 min-w-[180px] text-slate-100 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Employment Type & Remote */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Employment Type</label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Work Mode Preference</label>
          <div className="flex items-center gap-3 h-[42px]">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remoteAllowed}
                onChange={(e) => setRemoteAllowed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm text-slate-300">Allow / Prioritize Remote</span>
            </label>
          </div>
        </div>
      </div>

      {/* Compensation requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Minimum Monthly Stipend (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={minStipend}
            onChange={(e) => setMinStipend(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Min Annual Salary (₹ or $ - optional)
          </label>
          <input
            type="number"
            placeholder="e.g. 1200000"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Locations */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400" /> Preferred Locations
        </label>
        <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus-within:border-blue-500 transition-colors">
          {locations.map((loc) => (
            <span key={loc} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium">
              {loc}
              <button type="button" onClick={() => removeTag(loc, locations, setLocations)} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Type city (e.g. Bangalore, Hyderabad) & press Enter..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(locationInput, setLocationInput, locations, setLocations);
              }
            }}
            className="bg-transparent text-sm focus:outline-none flex-1 min-w-[180px] text-slate-100 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" /> Skills & Technologies
        </label>
        <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus-within:border-blue-500 transition-colors">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
              {s}
              <button type="button" onClick={() => removeTag(s, skills, setSkills)} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Type skill & press Enter..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(skillInput, setSkillInput, skills, setSkills);
              }
            }}
            className="bg-transparent text-sm focus:outline-none flex-1 min-w-[180px] text-slate-100 placeholder-slate-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Dispatching Job Agent...</span>
          </div>
        ) : (
          <>
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Start Autonomous Job & Internship Search</span>
          </>
        )}
      </button>
    </form>
  );
}
