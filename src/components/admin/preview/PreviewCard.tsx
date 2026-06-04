import type { Projeto } from "@/types";

interface PreviewCardProps {
  projeto: Projeto;
}

export function PreviewCard({ projeto }: PreviewCardProps) {
  return (
    <div className="max-w-sm border border-[--color-border] bg-[--color-bg]">
      <div className="aspect-[4/3] overflow-hidden border-b border-[--color-border] bg-[--color-surface]">
        {projeto.thumbnailCard ? (
          <img
            src={projeto.thumbnailCard}
            alt={projeto.titulo}
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.88)" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[--color-text-muted]">
            Thumbnail do card
          </div>
        )}
      </div>
      <div className="space-y-1 px-4 py-3">
        <h2
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {projeto.titulo || "Título do projeto"}
        </h2>
        <p className="line-clamp-2 text-xs text-[--color-text-muted]">
          {projeto.descricao ||
            "Descrição breve do projeto. Mostrada na listagem principal do portfólio."}
        </p>
      </div>
    </div>
  );
}

