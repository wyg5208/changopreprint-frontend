import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("投稿");

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
