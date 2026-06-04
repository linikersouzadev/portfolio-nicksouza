import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["rascunho", "publicado"]);
export const tiposBlocoEnum = pgEnum("tipo_bloco", ["imagem", "texto"]);

export const projetos = pgTable("projetos", {
  id: uuid("id").defaultRandom().primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  thumbnailCard: text("thumbnail_card").notNull(),
  imagemDestaque: text("imagem_destaque"),
  status: statusEnum("status").default("rascunho").notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

export const blocos = pgTable("blocos", {
  id: uuid("id").defaultRandom().primaryKey(),
  projetoId: uuid("projeto_id")
    .references(() => projetos.id, { onDelete: "cascade" })
    .notNull(),
  tipo: tiposBlocoEnum("tipo").notNull(),
  url: text("url"),
  destaque: boolean("destaque").default(false),
  conteudo: text("conteudo"),
  ordem: integer("ordem").notNull(),
});

