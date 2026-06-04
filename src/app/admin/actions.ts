"use server";

import { revalidatePath } from "next/cache";
import { getAdminServerClient } from "@/lib/supabase/server";
import { extractStoragePath } from "@/lib/supabase/storage";

export async function deleteProjetoAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getAdminServerClient();

  // Busca blocos para remover imagens do Storage
  const { data: blocos, error: blocosError } = await supabase
    .from("blocos")
    .select("url")
    .eq("projeto_id", id);

  if (blocosError) {
    console.error("Erro ao buscar blocos para exclusão:", blocosError);
    return { ok: false, error: "Erro ao preparar exclusão de blocos." };
  }

  const paths: string[] =
    blocos
      ?.map((b) => b.url as string | null)
      .filter((url): url is string => Boolean(url))
      .map((url) => {
        try {
          return extractStoragePath(url);
        } catch {
          return null;
        }
      })
      .filter((p): p is string => Boolean(p)) ?? [];

  // Remove arquivos do Storage (ignora erro para não bloquear a exclusão do projeto)
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("project-images")
      .remove(paths);
    if (storageError) {
      console.error("Erro ao remover arquivos do Storage:", storageError);
    }
  }

  // Exclui o projeto (blocos caem pelo ON DELETE CASCADE)
  const { error: deleteError } = await supabase.from("projetos").delete().eq("id", id);

  if (deleteError) {
    console.error("Erro ao excluir projeto:", deleteError);
    return { ok: false, error: "Erro ao excluir projeto." };
  }

  revalidatePath("/admin");
  revalidatePath("/");

  return { ok: true };
}

