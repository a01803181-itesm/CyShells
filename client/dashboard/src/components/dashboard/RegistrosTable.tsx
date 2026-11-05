import { useState } from "react";
import { Search, Loader2, AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTableRows, type TableRow } from "@/lib/api";

export function RegistrosTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("TODOS");

  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardTable", page, limit, risk, search],
    queryFn: () => getTableRows({ page, limit, risk, search }),
  });

  const tableRows = data?.data || [];
  const totalRecords = data?.total || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  const formatNumber = (num: number) => new Intl.NumberFormat('es-MX').format(num);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls Section: Search & Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuario o descripción..."
            className="w-full bg-background/40 border border-primary/30 rounded-md pl-10 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 transition-colors"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
          />
        </div>

        <select 
          className="bg-background/40 border border-primary/30 rounded-md px-4 py-2 text-xs font-mono focus:outline-none focus:border-primary text-foreground w-full sm:w-auto transition-colors"
          value={risk}
          onChange={(e) => {
            setRisk(e.target.value);
            setPage(1);
          }}
        >
          <option value="TODOS">Todos los Riesgos</option>
          <option value="ALTO">Riesgo: Alto</option>
          <option value="MEDIO">Riesgo: Medio</option>
          <option value="NULO">Riesgo: Nulo</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="glass-panel rounded-xl overflow-hidden border border-primary/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/20 bg-primary/5">
                <th className="px-4 py-3 text-xs font-mono tracking-widest text-muted-foreground uppercase whitespace-nowrap">Usuario</th>
                <th className="px-4 py-3 text-xs font-mono tracking-widest text-muted-foreground uppercase">Descripción</th>
                <th className="px-4 py-3 text-xs font-mono tracking-widest text-muted-foreground uppercase whitespace-nowrap">Métricas</th>
                <th className="px-4 py-3 text-xs font-mono tracking-widest text-muted-foreground uppercase whitespace-nowrap">Riesgo</th>
                <th className="px-4 py-3 text-xs font-mono tracking-widest text-muted-foreground uppercase whitespace-nowrap">Captura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-red-500 font-mono text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Error al cargar los registros.
                    </div>
                  </td>
                </tr>
              ) : tableRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-muted-foreground font-mono text-xs">
                    No se encontraron registros que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                tableRows.map((row: TableRow) => (
                  <tr key={row.videoId} className="hover:bg-primary/5 transition-colors group">
                    {/* User Info */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {row.avatarUrl ? (
                          <img src={row.avatarUrl} alt={row.username} className="h-8 w-8 rounded-full border border-primary/30 object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-primary cursor-pointer hover:underline">@{row.username}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">ID: {row.videoId}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Description */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-foreground/80 line-clamp-2 max-w-md">
                        {row.description || <span className="text-muted-foreground italic">Sin descripción</span>}
                      </p>
                    </td>

                    {/* Metrics */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono text-foreground">
                          ▶ {formatNumber(row.plays)}
                        </span>
                        <span className="text-xs font-mono text-foreground">
                          ❤ {formatNumber(row.likes)}
                        </span>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`badge ${
                        row.riskLevel === 'ALTO' ? 'badge-alto text-glow' : 
                        row.riskLevel === 'MEDIO' ? 'badge-medio' : 
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}>
                        {row.riskLevel}
                      </span>
                    </td>

                    {/* Scraped Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatDate(row.scrapedAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!isLoading && !isError && tableRows.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-primary/20 bg-primary/5">
            <span className="text-xs font-mono text-muted-foreground">
              Mostrando {tableRows.length} de {totalRecords} registros
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="flex items-center px-2 text-xs font-mono text-foreground">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}