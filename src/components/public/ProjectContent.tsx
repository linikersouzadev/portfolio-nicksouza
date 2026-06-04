import type { Projeto } from "@/types";

interface ProjectContentProps {
  projeto: Projeto;
  titulo?: string;
  descricao?: string;
}

export function ProjectContent({ projeto, titulo, descricao }: ProjectContentProps) {
  const blocos = projeto.blocos.slice().sort((a, b) => a.ordem - b.ordem);

  return (
    <section className="space-y-8">
      {/* Todos os blocos de imagem e texto */}
      {blocos.map((bloco) => {
        if (bloco.tipo === "imagem") {
          if (!bloco.url) return null;
          return (
            <figure key={bloco.id} className="flex justify-center">
              <div className="overflow-hidden rounded-sm bg-[--color-surface]">
                <img
                  src={bloco.url}
                  alt={projeto.titulo}
                  className="block max-h-[80vh] max-w-full"
                  loading="lazy"
                  style={{ filter: "saturate(0.95)" }}
                />
              </div>
            </figure>
          );
        }

        return (
          <article key={bloco.id} className="text-center">
            <p className="mx-auto max-w-xl whitespace-pre-line text-sm leading-relaxed text-[--color-text-muted] md:text-base">
              {bloco.conteudo}
            </p>
          </article>
        );
      })}

      {/* Título e descrição sempre ao final — empurrados pelos blocos acima */}
      {(titulo || descricao) && (
        <footer className="space-y-2 pt-4 text-center">
          {titulo && (
            <h1
              className="text-xl font-semibold leading-snug md:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {titulo}
            </h1>
          )}
          {descricao && (
            <p className="mx-auto max-w-md text-xs leading-relaxed text-[--color-text-muted] md:text-sm">
              {descricao}
            </p>
          )}
        </footer>
      )}
    </section>
  );
}
