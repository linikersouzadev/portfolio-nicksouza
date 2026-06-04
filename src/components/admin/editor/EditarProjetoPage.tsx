"use client";

import { useRouter } from "next/navigation";
import type { Projeto, BlocoImagem } from "@/types";
import { useProjetoEditor } from "@/hooks/useProjetoEditor";
import { ThumbnailCard } from "./ThumbnailCard";
import { ListaBlocos } from "./ListaBlocos";
import { BotaoAdicionarBloco } from "./BotaoAdicionarBloco";
import { StatusPublicacao } from "./StatusPublicacao";
import { BotoesAcao } from "./BotoesAcao";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { ModoPreview } from "../preview/ModoPreview";

interface EditarProjetoPageProps {
  projeto?: Projeto | null;
}

const getImagemDestaque = (blocos: ReturnType<typeof useProjetoEditor>["blocos"]) =>
  blocos.find((b): b is BlocoImagem => b.tipo === "imagem" && b.destaque);

export function EditarProjetoPage({ projeto }: EditarProjetoPageProps) {
  const router = useRouter();
  const editor = useProjetoEditor(projeto ?? undefined);

  const handleCancelar = () => {
    router.push("/admin");
  };

  const salvarBlocos = async (projetoId: string) => {
    const supabase = supabaseBrowserClient;

    await supabase.from("blocos").delete().eq("projeto_id", projetoId);

    const blocosParaSalvar = editor.blocos
      .filter((b) => {
        if (b.tipo === "imagem") return !!b.url;
        if (b.tipo === "texto") return b.conteudo.trim().length > 0;
        return false;
      })
      .map((b, index) => {
        if (b.tipo === "imagem") {
          return {
            projeto_id: projetoId,
            tipo: "imagem" as const,
            url: b.url,
            destaque: b.destaque,
            conteudo: null,
            ordem: index,
          };
        }
        return {
          projeto_id: projetoId,
          tipo: "texto" as const,
          url: null,
          destaque: false,
          conteudo: b.conteudo,
          ordem: index,
        };
      });

    if (blocosParaSalvar.length === 0) return null;

    const { error } = await supabase.from("blocos").insert(blocosParaSalvar);
    return error;
  };

  const handleGravar = async () => {
    const supabase = supabaseBrowserClient;

    const payloadProjeto = {
      titulo: editor.titulo,
      descricao: editor.descricao,
      thumbnail_card: editor.thumbnailCard.url,
      imagem_destaque: getImagemDestaque(editor.blocos)?.url ?? null,
      status: editor.status,
    };

    if (projeto) {
      const { error } = await supabase
        .from("projetos")
        .update(payloadProjeto)
        .eq("id", projeto.id);

      if (error) {
        alert("Erro ao atualizar projeto.");
        return;
      }

      const blocosError = await salvarBlocos(projeto.id);
      if (blocosError) {
        alert("Projeto salvo, mas houve erro ao salvar os blocos.");
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("projetos")
        .insert(payloadProjeto)
        .select("id")
        .maybeSingle();

      if (error || !data) {
        alert("Erro ao criar projeto.");
        return;
      }

      const novoId = data.id as string;

      const blocosError = await salvarBlocos(novoId);
      if (blocosError) {
        alert("Projeto criado, mas houve erro ao salvar os blocos.");
      }

      editor.resetAlteracoesNaoSalvas();
      router.push("/admin");
      return;
    }

    editor.resetAlteracoesNaoSalvas();
    router.push("/admin");
  };

  const projetoPreview: Projeto = {
    id: projeto?.id ?? "preview",
    titulo: editor.titulo || "Título do projeto",
    descricao:
      editor.descricao ||
      "Descrição breve do projeto. Mostrada na página interna e no card.",
    thumbnailCard: editor.thumbnailCard.url ?? "",
    imagemDestaque: getImagemDestaque(editor.blocos)?.url ?? undefined,
    status: editor.status,
    blocos: editor.blocos,
    criadoEm: projeto?.criadoEm ?? new Date(),
    atualizadoEm: projeto?.atualizadoEm ?? new Date(),
  };

  return (
    <>
      <form
        className="flex flex-col gap-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <section className="space-y-3">
          <label className="text-xs font-medium uppercase tracking-[0.16em]">
            Título do projeto
          </label>
          <input
            type="text"
            className="w-full border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
            placeholder="Nome do projeto"
            value={editor.titulo}
            onChange={(e) => editor.setTitulo(e.target.value)}
          />
        </section>

        <section className="space-y-3">
          <label className="text-xs font-medium uppercase tracking-[0.16em]">
            Descrição do projeto
          </label>
          <textarea
            rows={4}
            className="w-full border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
            placeholder="Descreva brevemente o projeto"
            value={editor.descricao}
            onChange={(e) => editor.setDescricao(e.target.value)}
          />
        </section>

        <ThumbnailCard
          url={editor.thumbnailCard.url}
          onUploaded={(url) => editor.setThumbnailCard(url)}
        />

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <h2
                className="text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Conteúdo do projeto
              </h2>
              <p className="mt-1 text-xs text-[--color-text-muted]">
                Intercale blocos de imagem e texto. As imagens aqui são o
                conteúdo interno, distintas da thumbnail do card.
              </p>
            </div>
            <BotaoAdicionarBloco
              onAddImagem={editor.adicionarBlocoImagem}
              onAddTexto={editor.adicionarBlocoTexto}
              totalImagens={editor.totalImagensBlocos}
              limiteImagens={6}
            />
          </div>

          <ListaBlocos
            blocos={editor.blocos}
            onReorder={editor.reordenarBlocos}
            onRemove={editor.removerBloco}
            onUpdateImagem={editor.atualizarBlocoImagem}
            onUpdateTexto={editor.atualizarBlocoTexto}
            onToggleDestaque={editor.marcarDestaque}
          />
        </section>

        <StatusPublicacao status={editor.status} onChange={editor.setStatus} />

        <BotoesAcao
          podeGravar={editor.podeGravar}
          podePrevisualizar={editor.podePrevisualizar}
          temAlteracoesNaoSalvas={editor.temAlteracoesNaoSalvas}
          onCancelar={handleCancelar}
          onPrevisualizar={editor.entrarPreview}
          onGravar={handleGravar}
        />
      </form>

      {editor.modoPreview && (
        <ModoPreview
          projetoPreview={projetoPreview}
          onClose={editor.sairPreview}
          onGravarEPublicar={async () => {
            editor.setStatus("publicado");
            await handleGravar();
          }}
        />
      )}
    </>
  );
}

