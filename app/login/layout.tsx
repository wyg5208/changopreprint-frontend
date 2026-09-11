import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("登录");

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
