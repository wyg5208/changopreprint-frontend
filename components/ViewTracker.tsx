"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    api.trackView(slug).catch(() => {
      // 浏览计数失败不影响阅读
    });
  }, [slug]);
  return null;
}
