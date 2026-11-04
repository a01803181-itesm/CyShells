import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { ChevronRight, Cpu } from "lucide-react";
import { OmegaVisionTab } from "@/components/ict/OmegaVisionTab";

export default function IctAnalysis() {
  // Tabs: "alpha", "beta", "omega"
  const [activeTab, setActiveTab] = useState("omega");

  return (
    <AppShell pageTitle="Análisis Algorítmico (ICT)">
      <div className="flex flex-col w-full max-w-7xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
        
        {/* Horizontal Funnel (Telemetry) */}
        <div className="funnel-container">
          <div className="funnel-step">
            <span className="funnel-value">12.4K</span>
            <span className="funnel-label">Scrape Inicial</span>
          </div>
          <ChevronRight className="funnel-divider" />
          
          <div className="funnel-step">
            <span className="funnel-value text-blue-400">3,402</span>
            <span className="funnel-label">Filtro Alpha (NLP)</span>
          </div>
          <ChevronRight className="funnel-divider" />
          
          <div className="funnel-step">
            <span className="funnel-value text-amber-400">843</span>
            <span className="funnel-label">Filtro Beta (Sentimiento)</span>
          </div>
          <ChevronRight className="funnel-divider" />
          
          <div className="funnel-step">
            <span className="funnel-value text-red-400 text-glow">142</span>
            <span className="funnel-label">Amenazas Omega</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-tabs-list">
          <button 
            onClick={() => setActiveTab("alpha")}
            className={`glass-tab ${activeTab === "alpha" ? "glass-tab-active" : ""}`}
          >
            Filtro Alpha (RAG NLP)
          </button>
          <button 
            onClick={() => setActiveTab("beta")}
            className={`glass-tab ${activeTab === "beta" ? "glass-tab-active" : ""}`}
          >
            Filtro Beta (Comentarios)
          </button>
          <button 
            onClick={() => setActiveTab("omega")}
            className={`glass-tab ${activeTab === "omega" ? "glass-tab-active" : ""}`}
          >
            Filtro Omega (Visión)
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="mt-2 relative min-h-100">
          
          {/* Alpha & Beta Placeholder State */}
          {(activeTab === "alpha" || activeTab === "beta") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center glass-panel rounded-xl border-dashed border-primary/30 animate-in zoom-in-95 duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Cpu className="h-16 w-16 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              </div>
              <h2 className="text-xl font-mono text-primary text-glow tracking-widest uppercase mb-2">
                RAG Pipeline Pending
              </h2>
              <p className="text-sm font-mono text-muted-foreground text-center max-w-md">
                La integración con el modelo RAG para análisis de texto y semántica de {activeTab === "alpha" ? "hashtags/descripciones" : "comentarios"} está actualmente en fase de calibración.
              </p>
            </div>
          )}

          {/* Omega Vision Content */}
          {activeTab === "omega" && <OmegaVisionTab />}
          
        </div>
      </div>
    </AppShell>
  );
}