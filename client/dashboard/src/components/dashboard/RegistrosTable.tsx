import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Database } from "lucide-react";

const TABLE_DATA = [
  {
    id: "7123456789",
    username: "@.ardilla76",
    risk: "ALTO",
    followers: 450000,
    posts: 120,
    comments: 4500,
    hashtags: ["#cartel", "#plaza", "#4L"],
    emojis: ["🧿", "🍅", "🍕"],
    music: ["Desconocido"],
  },
  {
    id: "8123456780",
    username: "@alfonsomanzanares83",
    risk: "MEDIO",
    followers: 280000,
    posts: 64,
    comments: 2100,
    hashtags: ["#alucin", "#jalo"],
    emojis: ["🤠", "🔥"],
    music: ["Corridos_Mix"],
  },
  {
    id: "9123456781",
    username: "@elheraldodemexico",
    risk: "NULO",
    followers: 150000,
    posts: 230,
    comments: 8900,
    hashtags: ["#noticias", "#mexico"],
    emojis: ["🚨", "📰"],
    music: ["Original_Sound"],
  },
];

const RiskBadge = ({ risk }: { risk: string }) => {
  const badgeClass = 
    risk === "ALTO" ? "badge-alto text-glow" : 
    risk === "MEDIO" ? "badge-medio" : "badge-nulo";
  return <span className={`badge ${badgeClass}`}>{risk}</span>;
};

export function RegistrosTable() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-header-title">Registros</h2>
        <div className="section-header-line" />
      </div>

      <div className="data-table-container">
        {/* Table Controls / Filters */}
        <div className="data-table-controls">
          <div>
            <h3 className="text-sm font-mono tracking-widest text-primary text-glow uppercase mb-1">
              Cuentas Detectadas
            </h3>
            <p className="text-xs text-muted-foreground font-mono">archivo: mongodb_connected</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="buscar cuenta..." className="data-table-input pl-9" />
            </div>
            <select className="data-table-input">
              <option>Riesgo: todos</option>
              <option>Alto</option>
              <option>Medio</option>
              <option>Nulo</option>
            </select>
            <select className="data-table-input hide-on-mobile-cell">
              <option>Hashtag: todos</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Riesgo</th>
                <th>Seguidores</th>
                <th className="hide-on-mobile-cell">Posts</th>
                <th className="hide-on-mobile-cell">Comentarios</th>
                <th className="hide-on-mobile-cell">Hashtags</th>
                <th className="hide-on-mobile-cell">Emojis</th>
                <th className="md:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Database className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Sin datos cargados</p>
                  </td>
                </tr>
              ) : (
                TABLE_DATA.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr onClick={() => toggleRow(row.id)}>
                      <td className="text-primary hover:underline">{row.username}</td>
                      <td><RiskBadge risk={row.risk} /></td>
                      <td className="font-mono">{row.followers.toLocaleString()}</td>
                      <td className="hide-on-mobile-cell font-mono">{row.posts}</td>
                      <td className="hide-on-mobile-cell font-mono">{row.comments.toLocaleString()}</td>
                      <td className="hide-on-mobile-cell text-xs">{row.hashtags.join(", ")}</td>
                      <td className="hide-on-mobile-cell tracking-widest">{row.emojis.join("")}</td>
                      <td className="md:hidden text-right">
                        {expandedRows.has(row.id) ? (
                          <ChevronUp className="inline h-4 w-4 text-primary" />
                        ) : (
                          <ChevronDown className="inline h-4 w-4 text-muted-foreground" />
                        )}
                      </td>
                    </tr>
                    
                    {/* Mobile Expanded View */}
                    {expandedRows.has(row.id) && (
                      <tr>
                        <td colSpan={4} className="p-0 border-0">
                          <div className="mobile-expanded-row">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">Posts</span>
                                <span className="font-mono">{row.posts}</span>
                              </div>
                              <div>
                                <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">Comentarios</span>
                                <span className="font-mono">{row.comments.toLocaleString()}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">Top Hashtags</span>
                              <span className="text-sm">{row.hashtags.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">Top Emojis</span>
                              <span className="text-sm tracking-widest">{row.emojis.join(" ")}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Export Controls */}
        <div className="p-4 md:p-6 bg-black/10 flex justify-end items-center gap-3 border-t border-primary/10">
          <span className="text-xs font-mono text-muted-foreground">exportar:</span>
          <button className="glass-panel glass-panel-hover px-3 py-1.5 rounded-md text-xs font-mono tracking-widest text-primary transition-all">
            JSON
          </button>
          <button className="glass-panel glass-panel-hover px-3 py-1.5 rounded-md text-xs font-mono tracking-widest text-primary transition-all">
            CSV
          </button>
        </div>
      </div>
    </div>
  );
}