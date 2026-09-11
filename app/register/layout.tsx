import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("注册");

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
