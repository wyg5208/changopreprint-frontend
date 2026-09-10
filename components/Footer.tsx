export default function Footer() {
  return (
    <footer className="cp-footer">
      <div className="cp-container">
        <p>
          ChangoPreprint 是面向马来西亚中国留学生的预印本服务器，
          <strong>不是期刊，稿件未经同行评审</strong>。
        </p>
        <p>作者对内容原创性负责，默认采用 CC BY 4.0 许可协议发布。</p>
        <p>
          文件长期归档于{" "}
          <a href="https://zenodo.org" target="_blank" rel="noreferrer">
            Zenodo
          </a>
          （CERN 运营），DOI 由 DataCite 注册；Zenodo 仅提供归档与 DOI 服务，
          不代表对内容的学术背书。
        </p>
        <p>
          本站账号为学术实名体系，与 MadeChango 社区账号（madechango.com）
          完全独立，两边不共享登录、不共享数据。
        </p>
      </div>
    </footer>
  );
}
