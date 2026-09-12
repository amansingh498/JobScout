import Link from 'next/link';
import { 
  Sparkles, Search, ShieldCheck, Cpu, ArrowRight, 
  Zap, Target, CheckCircle2, Award, BookOpen, Compass
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-20 py-8 sm:py-14">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wide border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Autonomous Job & Internship Research Agent
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]">
          Find verified jobs. <br />
          <span className="text-gradient">Expose ghost listings</span> & missing pay.
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          JobScout uncovers listings matching your exact criteria. When a job description omits compensation or remote policies, our agent scours verified web sources for evidence, audits phantom posting risks, and prepares a tailored interview blueprint.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
          <Link
            href="/search"
            className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/25 flex items-center gap-2.5 text-sm transition-all hover:scale-[1.02] group cursor-pointer"
          >
            <span>Launch Research Agent</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a
            href="#pipeline"
            className="px-7 py-4 rounded-2xl font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:text-white text-sm transition-all shadow-md"
          >
            Explore 7-Step Pipeline
          </a>
        </div>

        {/* Live metric pill bar */}
        <div className="pt-6 flex items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Deterministic Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Ghost Job Risk Auditor
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-400" /> Company Interview Blueprints
          </span>
        </div>
      </section>

      {/* Feature cards Grid */}
      <section id="pipeline" className="space-y-6 pt-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The Autonomous Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-400">Everything happens autonomously in the background before listings are presented.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card glass-card-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Targeted Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crawls career portals matching exact roles and skills, filtering duplicates via MD5 deduplication.
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Web Evidence Research</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discovers missing compensation & work modes with fixed confidence tiers (Confirmed $\ge$ 0.95 to Low &lt; 0.45).
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Ghost Job Auditor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits ATS domain authenticity, evergreen posting duration, and recruiter activity to rate legitimacy (0–100%).
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Action Center & Blueprint</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes round-by-round interview stages, leaked technical questions, and 1-click recruiter pitch kits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
