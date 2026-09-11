import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("我的稿件");

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
