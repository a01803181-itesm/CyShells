import AppShell from "@/components/layout/AppShell";
import { Share2 } from "lucide-react";

export default function NetworkAnalysis() {
  return (
    <AppShell pageTitle="Inteligencia de Redes">
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-700 text-center">
        <Share2 className="h-16 w-16 text-primary drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] mb-6" />
        <h2 className="text-2xl font-mono text-primary text-glow mb-2">Análisis de Redes de Cuentas</h2>
        <p className="text-muted-foreground max-w-md">
          Este módulo está en construcción. Próximamente visualizarás el grafo de conexiones entre cárteles, reclutadores y cuentas objetivo.
        </p>
      </div>
    </AppShell>
  );
}