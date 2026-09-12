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
      <body className="antialiased selection:bg-blue-600 selection:text-white bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col">
        <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                JS
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                  JobScout
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Agent
                  </span>
                </span>
                <span className="text-xs text-slate-400 -mt-0.5">Autonomous Job & Internship Researcher</span>
              </div>
            </a>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <a href="/search" className="text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/60">
                New Search
              </a>
              <a 
                href="https://github.com/amansingh498/JobScout" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
