import { Info } from "lucide-react";

const METADATA = {
  hashtags: [
    { name: "#cartel", count: 432 },
    { name: "#belico", count: 310 },
    { name: "#4L", count: 289 },
    { name: "#jalo", count: 245 },
    { name: "#sinaloa", count: 198 },
    { name: "#alucin", count: 187 },
    { name: "#plaza", count: 156 },
    { name: "#reclutamiento", count: 142 },
    { name: "#empresa", count: 120 },
    { name: "#jefe", count: 98 },
  ],
  emojis: [
    { name: "🍕", count: 289 },
    { name: "🐓", count: 150 },
    { name: "🔥", count: 145 },
    { name: "🧿", count: 132 },
    { name: "🤠", count: 110 },
    { name: "🍅", count: 95 },
    { name: "😈", count: 88 },
  ],
  music: [], // TODO
};

function MetadataList({ items, emptyMessage }: { items: { name: string; count: number }[], emptyMessage: string }) {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm font-mono text-muted-foreground uppercase tracking-widest">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="metadata-list">
      {items.map((item, index) => (
        <div key={item.name} className="metadata-item group">
          <span className="metadata-item-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="metadata-item-name group-hover:text-primary transition-colors">
            {item.name}
          </span>
          <span className="metadata-item-count">
            {item.count.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TopMetadata() {
  return (
    <div className="w-full">
      <div className="metadata-grid">
        
        {/* Hashtags Card */}
        <div className="metadata-card relative">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Hashtags más Usados (top 10)
            </h3>
            <Info className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <MetadataList items={METADATA.hashtags} emptyMessage="Sin datos de hashtags" />
        </div>

        {/* Emojis Card */}
        <div className="metadata-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Emojis más Usados
            </h3>
          </div>
          <MetadataList items={METADATA.emojis} emptyMessage="Sin datos de emojis" />
        </div>

        {/* Music Card */}
        <div className="metadata-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Música más Usada
            </h3>
          </div>
          <MetadataList items={METADATA.music} emptyMessage="Módulo en desarrollo" />
        </div>

        {/* Comments Card */}
        <div className="metadata-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Comentarios por Cuenta
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
              Visualización Condensada
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}