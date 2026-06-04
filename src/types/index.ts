export type StatusProjeto = "rascunho" | "publicado";

export type EstadoUpload = "idle" | "uploading" | "success" | "error";

export type BlocoImagem = {
  id: string;
  tipo: "imagem";
  url: string | null;
  estadoUpload: EstadoUpload;
  erroMensagem?: string;
  destaque: boolean;
  ordem: number;
};

export type BlocoTexto = {
  id: string;
  tipo: "texto";
  conteudo: string;
  ordem: number;
};

export type Bloco = BlocoImagem | BlocoTexto;

export interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  thumbnailCard: string;
  imagemDestaque?: string;
  status: StatusProjeto;
  blocos: Bloco[];
  criadoEm: Date;
  atualizadoEm: Date;
}

