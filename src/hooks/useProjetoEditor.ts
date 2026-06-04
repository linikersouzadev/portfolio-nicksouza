"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  Bloco,
  BlocoImagem,
  BlocoTexto,
  EstadoUpload,
  Projeto,
  StatusProjeto,
} from "@/types";

interface ProjetoEditorState {
  titulo: string;
  descricao: string;
  thumbnailCard: { url: string | null; estado: EstadoUpload };
  blocos: Bloco[];
  status: StatusProjeto;
  modoPreview: boolean;
  temAlteracoesNaoSalvas: boolean;
}

interface ProjetoEditorActions {
  setTitulo: (v: string) => void;
  setDescricao: (v: string) => void;
  setThumbnailCard: (url: string) => void;
  adicionarBlocoImagem: () => void;
  adicionarBlocoTexto: () => void;
  removerBloco: (id: string) => void;
  reordenarBlocos: (oldIndex: number, newIndex: number) => void;
  marcarDestaque: (id: string) => void;
  atualizarBlocoImagem: (
    id: string,
    url: string | null,
    estado: EstadoUpload,
    erroMensagem?: string,
  ) => void;
  atualizarBlocoTexto: (id: string, conteudo: string) => void;
  setStatus: (s: StatusProjeto) => void;
  entrarPreview: () => void;
  sairPreview: () => void;
  resetAlteracoesNaoSalvas: () => void;
}

interface ProjetoEditorComputed {
  podeGravar: boolean;
  podePrevisualizar: boolean;
  totalImagensBlocos: number;
}

export type UseProjetoEditorReturn = ProjetoEditorState &
  ProjetoEditorActions &
  ProjetoEditorComputed;

const criarBlocoImagem = (ordem: number): BlocoImagem => ({
  id: crypto.randomUUID(),
  tipo: "imagem",
  url: null,
  estadoUpload: "idle",
  destaque: false,
  ordem,
});

const criarBlocoTexto = (ordem: number): BlocoTexto => ({
  id: crypto.randomUUID(),
  tipo: "texto",
  conteudo: "",
  ordem,
});

function inicializarEstado(projeto?: Projeto | null): ProjetoEditorState {
  if (!projeto) {
    return {
      titulo: "",
      descricao: "",
      thumbnailCard: { url: null, estado: "idle" },
      blocos: [],
      status: "rascunho",
      modoPreview: false,
      temAlteracoesNaoSalvas: false,
    };
  }

  return {
    titulo: projeto.titulo,
    descricao: projeto.descricao,
    thumbnailCard: { url: projeto.thumbnailCard, estado: "success" },
    blocos: projeto.blocos,
    status: projeto.status,
    modoPreview: false,
    temAlteracoesNaoSalvas: false,
  };
}

function calcularComputed(state: ProjetoEditorState): ProjetoEditorComputed {
  const totalImagensBlocos = state.blocos.filter((b) => b.tipo === "imagem").length;
  const algumUploadEmAndamento =
    state.thumbnailCard.estado === "uploading" ||
    state.blocos.some((b) => b.tipo === "imagem" && b.estadoUpload === "uploading");

  const temTitulo = state.titulo.trim().length > 0;
  const temDescricao = state.descricao.trim().length > 0;
  const thumbnailOk = !!state.thumbnailCard.url;

  const podeGravar =
    temTitulo && temDescricao && thumbnailOk && !algumUploadEmAndamento;

  const podePrevisualizar = temTitulo && thumbnailOk;

  return {
    podeGravar,
    podePrevisualizar,
    totalImagensBlocos,
  };
}

export function useProjetoEditor(projeto?: Projeto | null): UseProjetoEditorReturn {
  const [state, setState] = useState<ProjetoEditorState>(() =>
    inicializarEstado(projeto),
  );

  const marcarAlterado = useCallback(
    (updater: (prev: ProjetoEditorState) => ProjetoEditorState) => {
      setState((prev) => ({
        ...updater(prev),
        temAlteracoesNaoSalvas: true,
      }));
    },
    [],
  );

  const setTitulo = useCallback(
    (v: string) =>
      marcarAlterado((prev) => ({
        ...prev,
        titulo: v,
      })),
    [marcarAlterado],
  );

  const setDescricao = useCallback(
    (v: string) =>
      marcarAlterado((prev) => ({
        ...prev,
        descricao: v,
      })),
    [marcarAlterado],
  );

  const setThumbnailCard = useCallback(
    (url: string) =>
      marcarAlterado((prev) => ({
        ...prev,
        thumbnailCard: { url, estado: "success" },
      })),
    [marcarAlterado],
  );

  const adicionarBlocoImagem = useCallback(
    () =>
      marcarAlterado((prev) => {
        const ordem = prev.blocos.length;
        return {
          ...prev,
          blocos: [...prev.blocos, criarBlocoImagem(ordem)],
        };
      }),
    [marcarAlterado],
  );

  const adicionarBlocoTexto = useCallback(
    () =>
      marcarAlterado((prev) => {
        const ordem = prev.blocos.length;
        return {
          ...prev,
          blocos: [...prev.blocos, criarBlocoTexto(ordem)],
        };
      }),
    [marcarAlterado],
  );

  const removerBloco = useCallback(
    (id: string) =>
      marcarAlterado((prev) => {
        const blocos = prev.blocos.filter((b) => b.id !== id);
        const reordenados = blocos
          .slice()
          .sort((a, b) => a.ordem - b.ordem)
          .map((b, index) => ({ ...b, ordem: index }));
        return { ...prev, blocos: reordenados };
      }),
    [marcarAlterado],
  );

  const reordenarBlocos = useCallback(
    (oldIndex: number, newIndex: number) =>
      marcarAlterado((prev) => {
        const blocosOrdenados = prev.blocos
          .slice()
          .sort((a, b) => a.ordem - b.ordem);
        const [moved] = blocosOrdenados.splice(oldIndex, 1);
        blocosOrdenados.splice(newIndex, 0, moved);
        const reordenados = blocosOrdenados.map((b, index) => ({
          ...b,
          ordem: index,
        }));
        return { ...prev, blocos: reordenados };
      }),
    [marcarAlterado],
  );

  const marcarDestaque = useCallback(
    (id: string) =>
      marcarAlterado((prev) => ({
        ...prev,
        blocos: prev.blocos.map((b) =>
          b.tipo === "imagem"
            ? {
                ...b,
                destaque: b.id === id,
              }
            : b,
        ),
      })),
    [marcarAlterado],
  );

  const atualizarBlocoImagem = useCallback(
    (
      id: string,
      url: string | null,
      estado: EstadoUpload,
      erroMensagem?: string,
    ) =>
      marcarAlterado((prev) => ({
        ...prev,
        blocos: prev.blocos.map((b) =>
          b.id === id && b.tipo === "imagem"
            ? {
                ...b,
                url,
                estadoUpload: estado,
                erroMensagem,
              }
            : b,
        ),
      })),
    [marcarAlterado],
  );

  const atualizarBlocoTexto = useCallback(
    (id: string, conteudo: string) =>
      marcarAlterado((prev) => ({
        ...prev,
        blocos: prev.blocos.map((b) =>
          b.id === id && b.tipo === "texto"
            ? {
                ...b,
                conteudo,
              }
            : b,
        ),
      })),
    [marcarAlterado],
  );

  const setStatus = useCallback(
    (s: StatusProjeto) =>
      marcarAlterado((prev) => ({
        ...prev,
        status: s,
      })),
    [marcarAlterado],
  );

  const entrarPreview = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        modoPreview: true,
      })),
    [],
  );

  const sairPreview = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        modoPreview: false,
      })),
    [],
  );

  const resetAlteracoesNaoSalvas = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        temAlteracoesNaoSalvas: false,
      })),
    [],
  );

  const computed = useMemo(() => calcularComputed(state), [state]);

  return {
    ...state,
    ...computed,
    setTitulo,
    setDescricao,
    setThumbnailCard,
    adicionarBlocoImagem,
    adicionarBlocoTexto,
    removerBloco,
    reordenarBlocos,
    marcarDestaque,
    atualizarBlocoImagem,
    atualizarBlocoTexto,
    setStatus,
    entrarPreview,
    sairPreview,
    resetAlteracoesNaoSalvas,
  };
}

