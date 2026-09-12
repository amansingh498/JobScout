import Link from 'next/link';
import { Sparkles, Search, ShieldCheck, Cpu, ArrowRight, Zap, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide border border-blue-500/20 shadow-sm shadow-blue-500/10">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Job Research Agent v1.0
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Stop guessing undisclosed <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">stipends & salaries</span>.
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          JobScout uncovers job and internship postings matching your preferences. When a JD omits critical compensation or remote policies, our agent scours official sources, placement reports, and employee records to verify details before ranking.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <Link
            href="/search"
            className="px-7 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 flex items-center gap-2 text-sm transition-all hover:gap-3 group cursor-pointer"
          >
            <span>Launch Research Agent</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
          <a
            href="#how-it-works"
            className="px-6 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:text-white text-sm transition-all"
          >
            How it Works
          </a>
        </div>
      </section>

      {/* Feature cards */}
      <section id="how-it-works" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Targeted Discovery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Crawls career portals and job boards for listings matching your exact roles, skills, and target locations.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Autonomous Web Research</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Flags missing fields and queries placement reports, reviews, and verified articles with confidence-weighted evidence.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Deterministic Scoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calculates 100-point transparent match scores with zero AI hallucination in ranking algorithms.
          </p>
        </div>
      </section>
    </div>
  );
}
