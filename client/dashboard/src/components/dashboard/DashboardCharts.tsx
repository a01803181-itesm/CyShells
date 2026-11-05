import { type Charts, getCharts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const CustomTooltip = ({ active, payload, label, prefix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border-primary/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-bold text-glow text-primary">
          {prefix}{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardCharts() {
  const { data: charts, isLoading } = useQuery<Charts>({
    queryKey: ["dashboardCharts"],
    queryFn: getCharts,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-header-title">Gráficas</h2>
        <div className="section-header-line" />
      </div>

      {/* Chart Grid */}
      <div className="chart-grid">
        
        {/* Followers Chart */}
        <div className="chart-card group">
          <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-6">
            Seguidores por Cuenta
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.topFollowers} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                <XAxis 
                  dataKey="name"
                  stroke="currentColor" 
                  className="text-xs opacity-50 font-mono"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(name) => name.substring(0, 8) + '...'}
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-xs opacity-50 font-mono"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(followers) => `${(followers / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.05)' }} />
                <Bar dataKey="followers" radius={[4, 4, 0, 0]}>
                  {charts?.topFollowers?.map((account) => (
                    <Cell key={`cell-${account.name}`} className="fill-primary hover:fill-primary/80 transition-colors" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Posts Chart */}
        <div className="chart-card group">
          <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-6">
            Publicaciones por Cuenta
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.topPosts} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor" 
                  className="text-xs opacity-50 font-mono"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.substring(0, 8) + '...'}
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-xs opacity-50 font-mono"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.05)' }} />
                <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                  {charts?.topPosts?.map((account) => (
                    <Cell key={`cell-${account.name}`} className="fill-primary hover:fill-primary/80 transition-colors" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}