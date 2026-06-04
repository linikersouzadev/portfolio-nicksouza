import type {
  Bloco,
  BlocoImagem,
  BlocoTexto,
  Projeto,
  StatusProjeto,
} from "@/types";
import { getPublicServerClient, getAdminServerClient } from "@/lib/supabase/server";

type ProjetoRow = {
  id: string;
  titulo: string;
  descricao: string;
  thumbnail_card: string;
  imagem_destaque: string | null;
  status: StatusProjeto;
  criado_em: string;
  atualizado_em: string;
};

type BlocoRow = {
  id: string;
  projeto_id: string;
  tipo: "imagem" | "texto";
  url: string | null;
  destaque: boolean | null;
  conteudo: string | null;
  ordem: number;
};

function mapBloco(row: BlocoRow): Bloco {
  if (row.tipo === "imagem") {
    const blocoImagem: BlocoImagem = {
      id: row.id,
      tipo: "imagem",
      url: row.url,
      estadoUpload: "success",
      destaque: Boolean(row.destaque),
      ordem: row.ordem,
    };
    return blocoImagem;
  }

  const blocoTexto: BlocoTexto = {
    id: row.id,
    tipo: "texto",
    conteudo: row.conteudo ?? "",
    ordem: row.ordem,
  };
  return blocoTexto;
}

function mapProjeto(row: ProjetoRow, blocos: Bloco[] = []): Projeto {
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    thumbnailCard: row.thumbnail_card,
    imagemDestaque: row.imagem_destaque ?? undefined,
    status: row.status,
    blocos,
    criadoEm: new Date(row.criado_em),
    atualizadoEm: new Date(row.atualizado_em),
  };
}

export async function getProjetosPublicados(): Promise<Projeto[]> {
  const supabase = getPublicServerClient();

  const { data, error } = await supabase
    .from("projetos")
    .select(
      "id, titulo, descricao, thumbnail_card, imagem_destaque, status, criado_em, atualizado_em",
    )
    .eq("status", "publicado")
    .order("criado_em", { ascending: false });

  if (error || !data) {
    console.error("Erro ao buscar projetos publicados:", error);
    return [];
  }

  return (data as ProjetoRow[]).map((row) => mapProjeto(row, []));
}

// Página pública — só projetos publicados
export async function getProjetoComBlocos(id: string): Promise<Projeto | null> {
  const supabase = getPublicServerClient();

  const [{ data: projetoData, error: projetoError }, { data: blocosData, error: blocosError }] =
    await Promise.all([
      supabase
        .from("projetos")
        .select(
          "id, titulo, descricao, thumbnail_card, imagem_destaque, status, criado_em, atualizado_em",
        )
        .eq("id", id)
        .eq("status", "publicado")
        .maybeSingle(),
      supabase
        .from("blocos")
        .select("id, projeto_id, tipo, url, destaque, conteudo, ordem")
        .eq("projeto_id", id)
        .order("ordem", { ascending: true }),
    ]);

  if (projetoError || !projetoData) {
    if (projetoError) console.error("Erro ao buscar projeto:", projetoError);
    return null;
  }

  if (blocosError) console.error("Erro ao buscar blocos do projeto:", blocosError);

  const blocos: Bloco[] = (blocosData as BlocoRow[] | null)?.map(mapBloco) ?? [];

  return mapProjeto(projetoData as ProjetoRow, blocos);
}

// Admin — carrega projeto e blocos independente do status
export async function getProjetoComBlocosAdmin(id: string): Promise<Projeto | null> {
  const supabase = getAdminServerClient();

  const [
    { data: projetoData, error: projetoError },
    { data: blocosData, error: blocosError },
  ] = await Promise.all([
    supabase
      .from("projetos")
      .select(
        "id, titulo, descricao, thumbnail_card, imagem_destaque, status, criado_em, atualizado_em",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("blocos")
      .select("id, projeto_id, tipo, url, destaque, conteudo, ordem")
      .eq("projeto_id", id)
      .order("ordem", { ascending: true }),
  ]);

  if (projetoError || !projetoData) {
    if (projetoError) console.error("Erro ao buscar projeto (admin):", projetoError);
    return null;
  }

  if (blocosError) console.error("Erro ao buscar blocos (admin):", blocosError);

  const blocos: Bloco[] = (blocosData as BlocoRow[] | null)?.map(mapBloco) ?? [];

  return mapProjeto(projetoData as ProjetoRow, blocos);
}

// Admin — lista todos os projetos independente do status
export async function getProjetosAdmin(): Promise<Projeto[]> {
  const supabase = getAdminServerClient();

  const { data, error } = await supabase
    .from("projetos")
    .select(
      "id, titulo, descricao, thumbnail_card, imagem_destaque, status, criado_em, atualizado_em",
    )
    .order("atualizado_em", { ascending: false });

  if (error || !data) {
    console.error("Erro ao buscar projetos (admin):", error);
    return [];
  }

  return (data as ProjetoRow[]).map((row) => mapProjeto(row, []));
}
