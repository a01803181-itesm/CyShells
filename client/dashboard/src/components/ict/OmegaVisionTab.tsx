import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Maximize2 } from "lucide-react";

const VISION_METRICS = [
  { label: "Armas Largas", count: 184 },
  { label: "Equipo Táctico", count: 152 },
  { label: "Insignias Cártel", count: 120 },
  { label: "Radios/Comms", count: 95 },
  { label: "Vehículos Blindados", count: 64 },
];

const GALLERY_DATA = [
  { id: "763550083", user: "@.ardilla76", risk: "ALTO", labels: ["Armas Largas", "Equipo Táctico"], image: "https://images.unsplash.com/photo-1595590424283-b8f1784cb2c8?w=500&q=80" },
  { id: "766070753", user: "@mederos640", risk: "ALTO", labels: ["Insignias Cártel", "Vehículos"], image: "https://images.unsplash.com/photo-1623998021446-45cd9b269056?w=500&q=80" },
  { id: "743274042", user: "@eduardopaulino0", risk: "MEDIO", labels: ["Radios/Comms"], image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80" },
  { id: "712345678", user: "@alfonsomanzanares", risk: "MEDIO", labels: ["Dinero en Efectivo"], image: "https://images.unsplash.com/photo-1625225230517-7426c1be750c?w=500&q=80" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border-primary/30">
        <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-bold text-glow text-primary">{payload[0].value} detecciones</p>
      </div>
    );
  }
  return null;
};

export function OmegaVisionTab() {
  const [filter, setFilter] = useState("TODOS");

  const filteredGallery = filter === "TODOS" 
    ? GALLERY_DATA 
    : GALLERY_DATA.filter(item => item.risk === filter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* Top Section: Telemetry Charts */}
      <div className="glass-panel rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-mono tracking-[0.2em] text-foreground uppercase">
            Top Etiquetas Detectadas (Computer Vision)
          </h3>
        </div>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={VISION_METRICS} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="label" stroke="currentColor" className="text-[10px] opacity-50 font-mono" tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-[10px] opacity-50 font-mono" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.05)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {VISION_METRICS.map((_, index) => (
                  <Cell key={`cell-${index}`} className="fill-primary hover:fill-primary/80 transition-colors" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Image Gallery */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xs font-mono tracking-[0.2em] text-foreground uppercase">
            Galería Táctica de Objetivos
          </h3>
          <select 
            className="bg-background/40 border border-primary/30 rounded-md px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-primary text-foreground w-full sm:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="TODOS">Riesgo: Todos</option>
            <option value="ALTO">Riesgo: Alto</option>
            <option value="MEDIO">Riesgo: Medio</option>
          </select>
        </div>

        <div className="gallery-grid">
          {filteredGallery.map((target) => (
            <div key={target.id} className="gallery-card group">
              <div className="gallery-image-wrapper">
                <img src={target.image} alt="Objetivo" className="gallery-image" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`badge ${target.risk === "ALTO" ? "badge-alto text-glow" : "badge-medio"}`}>
                    {target.risk}
                  </span>
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20 hover:border-primary/50 text-white">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Usuario</p>
                    <p className="text-sm font-medium text-primary hover:underline cursor-pointer">{target.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Video ID</p>
                    <p className="text-[10px] font-mono text-foreground">{target.id}</p>
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-primary/10">
                  <div className="flex flex-wrap gap-1.5">
                    {target.labels.map((label, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-mono text-primary">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}