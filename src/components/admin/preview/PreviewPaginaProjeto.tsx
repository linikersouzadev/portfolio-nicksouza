import type { Projeto } from "@/types";
import { ProjectContent } from "@/components/public/ProjectContent";

interface PreviewPaginaProjetoProps {
  projeto: Projeto;
}

export function PreviewPaginaProjeto({ projeto }: PreviewPaginaProjetoProps) {
  return (
    <div className="min-h-[60vh] border border-[--color-border] bg-[--color-bg]">
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        <section className="max-w-3xl space-y-4">
          <h1
            className="text-balance text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {projeto.titulo}
          </h1>
          <p className="text-sm leading-relaxed text-[--color-text-muted] md:text-base">
            {projeto.descricao}
          </p>
        </section>
        <ProjectContent projeto={projeto} />
      </div>
    </div>
  );
}

