import { getKPIs, type KPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const KPI_DATA = [
  {
    id: "monitored",
    title: "Cuentas Monitoreadas",
    value: "142",
    subtext: "Perfiles Únicos",
    indicatorColor: "text-red-500 bg-red-500",
  },
  {
    id: "followers",
    title: "Seguidores Totales",
    value: "15.4M",
    subtext: "Alcance Acumulado",
    indicatorColor: "text-amber-500 bg-amber-500",
  },
  {
    id: "publications",
    title: "Publicaciones",
    value: "843",
    subtext: "Videos Registrados",
    indicatorColor: "text-cyan-500 bg-cyan-500",
  },
  {
    id: "comments",
    title: "Comentarios",
    value: "42.1K",
    subtext: "Interacciones",
    indicatorColor: "text-blue-500 bg-blue-500",
  },
  {
    id: "hashtag",
    title: "Hashtag Principal",
    value: "#4L",
    subtext: "Más Frecuente",
    indicatorColor: "text-slate-300 bg-slate-300",
  },
  {
    id: "emoji",
    title: "Emoji Principal",
    value: "🍕",
    subtext: "Más Frecuente",
    indicatorColor: "text-slate-300 bg-slate-300",
  },
];

export function KpiResumen() {
  const { data: kpis = [], isLoading } = useQuery<KPI[]>({
    queryKey: ["dashboardKPIs"],
    queryFn: getKPIs,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <h2 className="text-xs font-mono tracking-widest text-muted-foreground uppercase mr-4">
          Resumen
        </h2>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="kpi-card group">
            <h3 className="kpi-title">{kpi.title}</h3>
            
            <div className={`kpi-indicator ${kpi.indicatorColour}`} />
            
            <div className="mt-auto">
              <div className="kpi-value group-hover:scale-105 transition-transform origin-left">
                {kpi.value}
              </div>
              <p className="kpi-subtext">{kpi.subtext}</p>
            </div>
            
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-10 ${kpi.indicatorColour}`} aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}