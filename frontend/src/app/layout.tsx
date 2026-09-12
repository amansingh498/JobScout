import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobScout — Autonomous Job & Internship Research Agent",
  description: "Discovers jobs and internships, verifies missing info with autonomous web research, and ranks listings by exact match criteria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-blue-600 selection:text-white bg-[#07090e] text-slate-100 min-h-screen flex flex-col relative">
        {/* Ambient background glow mesh */}
        <div className="bg-mesh-glow" />

        {/* Global Navigation Header */}
        <header className="border-b border-slate-800/60 bg-slate-950/75 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all duration-300">
                  JS
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse-dot" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-2">
                  JobScout
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    AI Agent
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 -mt-0.5">Autonomous Research & Verification</span>
              </div>
            </a>

            <nav className="flex items-center gap-3 text-sm font-medium">
              <a 
                href="/search" 
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>New Search</span>
              </a>
              <a 
                href="https://github.com/amansingh498/JobScout" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-slate-200 border border-slate-800/80 px-3 py-2 rounded-xl hover:bg-slate-800/50 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
