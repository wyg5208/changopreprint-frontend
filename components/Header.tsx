import Link from "next/link";

export default function Header() {
  return (
    <header className="cp-header">
      <div className="cp-container">
        <Link href="/" className="cp-brand">
          ChangoPreprint
        </Link>
        <nav className="cp-nav">
          <Link href="/">浏览</Link>
          <Link href="/submit">投稿</Link>
          <Link href="/login">登录</Link>
          <Link href="/register">注册</Link>
        </nav>
      </div>
    </header>
  );
}
