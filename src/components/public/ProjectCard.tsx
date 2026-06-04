"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Projeto } from "@/types";

interface ProjectCardProps {
  projeto: Projeto;
  index: number;
}

export function ProjectCard({ projeto, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative overflow-hidden"
    >
      <Link href={`/project/${projeto.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={projeto.thumbnailCard}
            alt={projeto.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ filter: "saturate(0.88)" }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(20,18,16,0.55)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-4 pb-4 pt-8 text-center opacity-0 translate-y-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            <h2
              className="text-base font-semibold tracking-wide text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {projeto.titulo}
            </h2>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
