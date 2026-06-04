import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectContent } from "@/components/public/ProjectContent";
import { getProjetoComBlocos } from "@/lib/db/queries";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const projeto = await getProjetoComBlocos(id);

  if (!projeto) {
    return {
      title: "Projeto não encontrado · Nick Souza",
    };
  }

  const title = `${projeto.titulo} · Portfolio — Nick Souza`;
  const description = projeto.descricao;
  const image = projeto.thumbnailCard;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projeto = await getProjetoComBlocos(id);

  if (!projeto) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-12 py-8">
      {/* Conteúdo dos blocos — título e descrição renderizados dentro após a primeira imagem */}
      <ProjectContent projeto={projeto} titulo={projeto.titulo} descricao={projeto.descricao} />
    </div>
  );
}
