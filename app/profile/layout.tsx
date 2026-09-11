import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("个人资料");

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
