import type { Projeto } from "@/types";
import { ProjectCard } from "./ProjectCard";

interface PortfolioGridProps {
  projetos: Projeto[];
}

export function PortfolioGrid({ projetos }: PortfolioGridProps) {
  if (!projetos.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[--color-text-muted]">
        <p>Nenhum projeto publicado ainda. Em breve, ilustrações e concept art aqui.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {projetos.map((projeto, index) => (
        <ProjectCard key={projeto.id} projeto={projeto} index={index} />
      ))}
    </section>
  );
}
