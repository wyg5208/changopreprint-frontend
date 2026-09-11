import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("管理");

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
