'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserPreferences, ResumeParseResult } from '@/types/job';
import { createSearch, uploadAndParseResume } from '@/lib/api';
import { 
  Sparkles, Plus, X, Search, DollarSign, MapPin, 
  Briefcase, Code, Upload, FileText, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';

export function PreferenceForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState<string | null>(null);

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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setResumeFileName(file.name);
    setIsUploadingResume(true);
    setResumeSuccess(null);
    setError(null);

    try {
      const parsed: ResumeParseResult = await uploadAndParseResume(file);
      setResumeText(parsed.resume_text);
      setResumeSkills(parsed.skills);
      
      // Auto-merge newly parsed skills into search criteria
      const mergedSkills = Array.from(new Set([...skills, ...parsed.skills]));
      setSkills(mergedSkills);

      // If suggested roles exist and current roles are default, suggest them
      if (parsed.suggested_roles && parsed.suggested_roles.length > 0) {
        setTargetRoles(parsed.suggested_roles);
      }

      setResumeSuccess(`Parsed ${parsed.skills.length} skills from ${file.name}`);
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume file');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const applyPreset = (preset: {
    roles: string[];
    skills: string[];
    locations: string[];
    stipend: number;
    type: string;
    remote: boolean;
  }) => {
    setTargetRoles(preset.roles);
    setSkills(preset.skills);
    setLocations(preset.locations);
    setMinStipend(preset.stipend);
    setEmploymentType(preset.type);
    setRemoteAllowed(preset.remote);
  };

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
      resume_text: resumeText,
      resume_skills: resumeSkills.length > 0 ? resumeSkills : skills,
      resume_filename: resumeFileName,
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
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-700/80">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 📄 Resume Upload & ATS Matcher Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 space-y-3 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                Upload Candidate Resume (PDF / TXT)
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-bold">
                  Auto-Skill Matcher
                </span>
              </span>
              <p className="text-xs text-slate-300">
                Agent extracts your exact skills to calculate ATS fit & discover skill gaps.
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleResumeUpload}
            accept=".pdf,.txt,.md,.doc,.docx"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingResume}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {isUploadingResume ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting Skills...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {resumeFileName ? 'Change Resume' : 'Upload Resume File'}
              </>
            )}
          </button>
        </div>

        {/* Upload feedback & Extracted Skills preview */}
        {resumeSuccess && (
          <div className="space-y-2 pt-2 border-t border-indigo-800/50">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{resumeSuccess}</span>
            </div>

            {resumeSkills.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Extracted Resume Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-indigo-300" /> {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1-Click Demo Persona Presets */}
      <div className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-slate-700 shadow-sm">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Quick 1-Click Demo Persona Presets:
        </span>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset({
              roles: ['AI / ML Research Intern'],
              skills: ['Python', 'PyTorch', 'Deep Learning', 'Transformers'],
              locations: ['Bangalore', 'Hyderabad'],
              stipend: 80000,
              type: 'Internship',
              remote: false
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 transition-all cursor-pointer shadow-sm"
          >
            🤖 AI & ML Researcher
          </button>

          <button
            type="button"
            onClick={() => applyPreset({
              roles: ['Full Stack Engineer Intern', 'Frontend Developer'],
              skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
              locations: ['Bangalore', 'Remote'],
              stipend: 50000,
              type: 'Internship',
              remote: true
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/40 transition-all cursor-pointer shadow-sm"
          >
            ⚡ Full Stack Developer
          </button>

          <button
            type="button"
            onClick={() => applyPreset({
              roles: ['Mobile App Developer Intern'],
              skills: ['Flutter', 'React Native', 'Kotlin', 'Swift'],
              locations: ['Bangalore'],
              stipend: 60000,
              type: 'Internship',
              remote: false
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 transition-all cursor-pointer shadow-sm"
          >
            📱 Mobile / Flutter
          </button>

          <button
            type="button"
            onClick={() => applyPreset({
              roles: ['Cloud & DevOps Engineer Intern'],
              skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
              locations: ['Remote'],
              stipend: 55000,
              type: 'Internship',
              remote: true
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 transition-all cursor-pointer shadow-sm"
          >
            ☁️ Cloud & DevOps
          </button>
        </div>
      </div>

      {/* Target Roles */}
      <div>
        <label className="block text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" /> Target Roles & Keywords
        </label>
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700 focus-within:border-blue-400 transition-colors shadow-inner">
          {targetRoles.map((role) => (
            <span key={role} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/30 border border-blue-400/50 text-blue-100 text-sm font-bold shadow-sm">
              {role}
              <button type="button" onClick={() => removeTag(role, targetRoles, setTargetRoles)} className="hover:text-rose-300 transition-colors">
                <X className="w-4 h-4" />
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
            className="bg-transparent text-sm focus:outline-none flex-1 min-w-[180px] text-white placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Employment Type & Remote */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-100 mb-2">Employment Type</label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-blue-400"
          >
            <option value="Internship" className="bg-slate-900 text-white">Internship</option>
            <option value="Full-time" className="bg-slate-900 text-white">Full-time</option>
            <option value="Contract" className="bg-slate-900 text-white">Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-100 mb-2">Work Mode Preference</label>
          <div className="flex items-center gap-3 h-[46px] px-4 bg-slate-900 border border-slate-700 rounded-xl">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remoteAllowed}
                onChange={(e) => setRemoteAllowed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-semibold text-slate-200">Allow / Prioritize Remote</span>
            </label>
          </div>
        </div>
      </div>

      {/* Compensation requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Minimum Monthly Stipend (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={minStipend}
            onChange={(e) => setMinStipend(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-blue-400 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Min Annual Salary (₹ or $ - optional)
          </label>
          <input
            type="number"
            placeholder="e.g. 1200000"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-blue-400 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Locations */}
      <div>
        <label className="block text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400" /> Preferred Locations
        </label>
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700 focus-within:border-blue-400 transition-colors shadow-inner">
          {locations.map((loc) => (
            <span key={loc} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-100 text-sm font-bold shadow-sm">
              {loc}
              <button type="button" onClick={() => removeTag(loc, locations, setLocations)} className="hover:text-white transition-colors">
                <X className="w-4 h-4" />
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
            className="bg-transparent text-sm focus:outline-none flex-1 min-w-[180px] text-white placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" /> Skills & Technologies
        </label>
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700 focus-within:border-blue-400 transition-colors shadow-inner">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-100 text-sm font-bold shadow-sm">
              {s}
              <button type="button" onClick={() => removeTag(s, skills, setSkills)} className="hover:text-white transition-colors">
                <X className="w-4 h-4" />
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
            className="bg-transparent text-sm focus:outline-none flex-1 min-w-[180px] text-white placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
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
