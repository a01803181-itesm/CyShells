import { useState } from "react";
import { 
  LayoutDashboard, 
  Filter, 
  Share2, 
  LogOut, 
  User,
  Activity
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "ict", label: "Filtro Omega (ICT)", icon: Filter, path: "/ict" },
  { id: "network", label: "Análisis de Redes", icon: Share2, path: "/network" },
];

export default function AppShell({ children, pageTitle = "Visión General" }: { children: React.ReactNode, pageTitle?: string }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="app-shell">
      
      {/* LEFT SIDEBAR (DESKTOP/TABLET) */}
      <aside className="app-sidebar">
        <div>
          <div className="flex items-center justify-center lg:justify-start h-16 px-4 lg:px-6 border-b border-primary/10">
            <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_#06b6d4] mr-0 lg:mr-3 animate-pulse" />
            <span className="sidebar-text text-lg tracking-wider text-glow uppercase">
              CYSHELLS
            </span>
          </div>

          <nav className="flex flex-col gap-2 p-2 lg:p-4 mt-4">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-center lg:justify-start gap-4 px-3 py-3 rounded-md transition-all duration-300 ${
                    isActive 
                      ? "bg-primary/10 border border-primary/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)] text-primary" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : ""}`} />
                  <span className="sidebar-text">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-2 lg:p-4 border-t border-primary/10">
          <button className="flex w-full items-center justify-center lg:justify-start gap-4 px-3 py-3 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="sidebar-text">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="app-main">
        {/* TOPBAR */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 glass-panel border-b-0 z-10">
          <h1 className="text-xl md:text-2xl font-mono text-primary text-glow font-semibold tracking-tight">
            {pageTitle}
          </h1>

          <div className="hide-on-mobile items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-white/5">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">NO DATA YET</span>
          </div>

          <div className="flex items-center gap-2 bg-background/80 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.05)]">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-muted-foreground hide-on-mobile">
              alexijia24@gmail.com
            </span>
            <User className="h-4 w-4 sm:hidden text-primary" />
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="app-scroll-area">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>

        {/* BOTTOM NAV (MOBILE) */}
        <nav className="app-bottom-bar">
          <div className="flex items-center justify-around h-16">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`p-1.5 rounded-full ${isActive ? "bg-primary/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : ""}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}