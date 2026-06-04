"use client";

import { useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import type { EstadoUpload } from "@/types";

interface UseUploadReturn {
  upload: (file: File, pathPrefix: string) => Promise<string>;
  estado: EstadoUpload;
  progresso: number;
  erro: string | null;
  resetar: () => void;
}

const BUCKET = "project-images";

export function useUpload(): UseUploadReturn {
  const [estado, setEstado] = useState<EstadoUpload>("idle");
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

  const resetar = () => {
    setEstado("idle");
    setProgresso(0);
    setErro(null);
  };

  const upload = async (file: File, pathPrefix: string): Promise<string> => {
    if (!supabaseBrowserClient) {
      const message = "Supabase não configurado para upload.";
      setErro(message);
      setEstado("error");
      throw new Error(message);
    }

    if (!file.type.startsWith("image/")) {
      const message = "Apenas arquivos de imagem são permitidos.";
      setErro(message);
      setEstado("error");
      throw new Error(message);
    }

    // ~10MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const message = "Imagem muito grande. Limite de 10MB por arquivo.";
      setErro(message);
      setEstado("error");
      throw new Error(message);
    }

    try {
      setEstado("uploading");
      setProgresso(10);
      setErro(null);

      const ext = file.name.split(".").pop() ?? "png";
      const filePath = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabaseBrowserClient.storage
        .from(BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabaseBrowserClient.storage.from(BUCKET).getPublicUrl(filePath);

      setProgresso(100);
      setEstado("success");

      return publicUrl;
    } catch (e: any) {
      const message = e?.message ?? "Erro ao fazer upload.";
      setErro(message);
      setEstado("error");
      setProgresso(0);
      throw e;
    }
  };

  return { upload, estado, progresso, erro, resetar };
}

