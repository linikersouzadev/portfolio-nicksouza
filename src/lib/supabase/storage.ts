import { getAdminServerClient } from "./server";

const BUCKET = "project-images";

export async function uploadImage(
  file: File,
  pathPrefix: string,
): Promise<string> {
  const supabase = getAdminServerClient();

  const fileExt = file.name.split(".").pop() ?? "png";
  const fileName = `${pathPrefix}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = getAdminServerClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export function extractStoragePath(publicUrl: string): string {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) throw new Error("URL não pertence ao bucket project-images");
  return publicUrl.slice(idx + marker.length);
}

