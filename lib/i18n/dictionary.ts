// ChangoPreprint 中英文双语词典。
//
// 刻意不引入 next-intl / react-i18next 等重依赖 —— 本站规模小（8个页面、
// 7个组件），用一个纯 Context + 词典对象即可满足需求，避免多一层
// 路由(locale)重构风险（会影响已经被 Google Scholar 收录的落地页 URL）。
//
// 语言切换是纯客户端行为（localStorage 记忆），不改变 URL；SSR 首次输出
// 固定为中文，Hydrate 后根据用户上次选择切到对应语言，这对 SEO 友好
// （爬虫抓到的是完整中文内容，不会抓到空壳）。

export type Locale = "zh" | "en";

export const dictionaries: Record<Locale, Record<string, string>> = {
  zh: {
    // ---- 顶部导航 ----
    nav_browse: "浏览",
    nav_showcase: "学术资讯",
    nav_submit: "投稿",
    nav_login: "登录",
    nav_register: "注册",
    nav_dashboard: "我的稿件",
    nav_profile: "编辑资料",
    nav_logout: "退出登录",

    // ---- 页脚 ----
    footer_p1_before: "ChangoPreprint 是面向马来西亚中国留学生的预印本服务器，",
    footer_p1_strong: "不是期刊，稿件未经同行评审",
    footer_p1_after: "。",
    footer_p2: "作者对内容原创性负责，默认采用 CC BY 4.0 许可协议发布。",
    footer_p3_before: "文件长期归档于 ",
    footer_p3_after:
      "（CERN 运营），DOI 由 DataCite 注册；Zenodo 仅提供归档与 DOI 服务，不代表对内容的学术背书。",
    footer_p4:
      "本站账号为学术实名体系，与 MadeChango 社区账号（madechango.com）完全独立，两边不共享登录、不共享数据。",

    // ---- 首页 Hero ----
    hero_title: "为马来西亚中国留学生打造的开放学术预印本平台",
    hero_subtitle: "快速获得永久可引用 DOI，抢占学术优先权，让你的研究成果被更早看到、更早引用。",
    hero_search_placeholder: "搜索标题、摘要或关键词…",
    hero_search_button: "搜索",
    hero_cta_submit: "立即投稿",
    hero_cta_showcase: "浏览学术资讯",

    // ---- 首页统计条 ----
    stats_published_label: "本站原创已发布预印本",
    stats_showcase_label: "学术资讯精选（来自 {n} 个平台）",
    stats_doi_value: "永久归档",
    stats_doi_label: "DOI 由 Zenodo/DataCite 注册",
    stats_free_value: "0 元",
    stats_free_label: "完全免费，无版面费",

    // ---- 首页：学术资讯预览 ----
    home_news_heading: "学术资讯",
    home_news_more: "查看全部",

    // ---- 首页：搜索结果 ----
    home_search_result_prefix: "搜索 “{q}” 的结果",
    home_search_clear: "清除搜索",

    // ---- 首页：为什么投稿 ----
    benefits_heading: "为什么选择 ChangoPreprint",
    benefit_doi_title: "极速获得永久DOI",
    benefit_doi_desc: "审核通过后自动发布到 Zenodo，几分钟内获得可永久引用的 DOI，无需等待期刊排队。",
    benefit_priority_title: "抢占学术优先权",
    benefit_priority_desc: "带时间戳的公开记录，第一时间证明你的想法和成果，避免被他人抢先发表。",
    benefit_cite_title: "方便引用与传播",
    benefit_cite_desc: "标准化元数据 + 可引用 DOI，方便同行检索、引用，并支持关联后续正式期刊发表。",
    benefit_free_title: "完全免费・门槛低",
    benefit_free_desc: "面向马来西亚中国留学生完全免费开放，无版面费，本科生、硕博生、教职工均可投稿。",

    // ---- 首页：最新预印本 ----
    home_title: "最新预印本",
    home_desc: "未同行评审的学术预印本，发布后获得 Zenodo/DataCite 注册的可引用 DOI。",
    home_empty: "暂无已发布预印本。",
    home_prev: "上一页",
    home_next: "下一页",
    home_page: "第 {page} / {pages} 页",

    // ---- 预印本卡片 / 统计 ----
    card_stats: "浏览 {views} · 下载 {downloads}",

    // ---- 学术资讯（精选外部预印本） ----
    showcase_title: "学术资讯",
    showcase_desc:
      "精选来自 arXiv、SSRN、bioRxiv 等主流预印本平台的最新学术资讯，均转载自原平台公开信息，非本站投稿，不代表本站已收录或已授予 DOI，点击「阅读原文」查看完整内容。",
    showcase_empty: "暂无资讯，请稍后再来。",
    showcase_source_prefix: "转自 {source}",
    showcase_read_original: "阅读原文",
    showcase_authors_more: "等",

    // ---- 登录页 ----
    login_title: "登录 ChangoPreprint",
    login_desc: "本站账号为学术实名体系，与 MadeChango 社区账号完全独立。",
    login_email_label: "邮箱",
    login_password_label: "密码",
    login_submit: "登录",
    login_submit_loading: "登录中…",
    login_error_default: "登录失败",

    // ---- 注册页 ----
    register_title: "注册 ChangoPreprint 账号",
    register_desc: "投稿需要学术实名审核：请填写法定姓名与所属高校，建议补充 ORCID。",
    register_email_label: "邮箱 *",
    register_password_label: "密码 *（至少 8 位）",
    register_fullname_label: "法定姓名 *",
    register_university_label: "所属高校 *",
    register_university_placeholder: "例如：马来亚大学",
    register_student_type_label: "身份",
    register_student_type_placeholder: "请选择",
    register_student_type_undergrad: "本科生",
    register_student_type_master: "硕士生",
    register_student_type_phd: "博士生",
    register_student_type_faculty: "教职工",
    register_student_type_other: "其它",
    register_orcid_label: "ORCID（建议填写）",
    register_academic_email_label: "学校邮箱（便于人工核验身份）",
    register_submit: "提交注册",
    register_submit_loading: "提交中…",
    register_error_default: "注册失败",
    register_success_title: "注册成功",
    register_success_body:
      "您的实名资料已提交，需等待管理员审核通过（verification_status: pending）后才能投稿。即将跳转到登录页…",

    // ---- 投稿页 ----
    submit_title: "投稿 ChangoPreprint",
    submit_title_zh_label: "中文标题",
    submit_title_en_label: "英文标题",
    submit_title_hint: "中英文标题至少填一个",
    submit_abstract_zh_label: "中文摘要",
    submit_abstract_en_label: "英文摘要",
    submit_language_label: "语言",
    submit_language_zh: "中文",
    submit_language_en: "英文",
    submit_language_bilingual: "中英双语",
    submit_subject_label: "学科领域",
    submit_subject_placeholder: "例如：教育学 / Computer Science",
    submit_keywords_label: "关键词（逗号分隔）",
    submit_license_label: "许可证",
    license_cc_by: "CC BY 4.0（默认，推荐）",
    license_cc_by_sa: "CC BY-SA 4.0",
    license_cc_by_nc: "CC BY-NC 4.0",
    submit_authors_heading: "作者",
    author_name_label: "姓名 *",
    author_affiliation_label: "单位",
    author_orcid_label: "ORCID",
    author_corresponding_label: "通讯作者",
    add_author_button: "+ 添加作者",
    create_draft_button: "下一步：上传 PDF",
    create_draft_loading: "创建中…",
    submit_error_create_draft: "创建草稿失败",
    upload_pdf_heading: "上传预印本 PDF 主文件",
    upload_submit_button: "上传并提交审核",
    upload_submit_loading: "上传中…",
    submit_error_upload: "上传/提交失败",
    submit_done_title: "已提交审核",
    submit_done_body_before: "稿件 ",
    submit_done_body_after:
      " 已进入审核队列。管理员通过后会自动发布到 Zenodo 并生成 DOI，可在「我的稿件」页面查看进度。",
    view_my_submissions_button: "查看我的稿件",

    // ---- 我的稿件页 ----
    dashboard_title: "我的稿件",
    dashboard_error: "加载失败，请重新登录",
    dashboard_empty_before: "暂无稿件，去 ",
    dashboard_empty_link: "投稿",
    dashboard_empty_after: " 吧。",
    dashboard_view_landing: "查看落地页",
    status_draft: "草稿",
    status_submitted: "已提交，待审核",
    status_under_review: "发布中（正在同步 Zenodo）",
    status_published: "已发布",
    status_rejected: "已拒绝",
    status_withdrawn: "已撤稿",

    // ---- 已发布稿件的操作（撤稿/关联DOI/新版本） ----
    published_withdraw_button: "撤稿",
    published_link_doi_button: "关联期刊DOI",
    published_upload_version_button: "上传新版本",
    published_journal_doi_linked: "已关联期刊 DOI: {doi}",
    published_pending_version_hint: "第 {n} 版已上传，等待管理员审核发布到 Zenodo",
    published_withdrawal_note_label: "撤稿说明：",
    published_withdraw_placeholder: "撤稿说明（必填，会公开展示在落地页）",
    published_withdraw_confirm: "确认撤稿",
    published_doi_placeholder: "正式期刊 DOI，例如 10.1000/xyz123",
    published_submit: "提交",
    published_changelog_placeholder: "修订说明（选填）",
    published_upload: "上传",
    published_withdraw_failed: "撤稿失败",
    published_link_failed: "关联失败",
    published_upload_failed: "上传失败",
    published_version_uploaded_success: "新版本已上传，等待管理员审核发布到 Zenodo",

    // ---- 管理后台：用户实名审核 ----
    admin_user_review_heading: "用户实名审核",
    admin_user_review_desc: "通过后该用户才能投稿（can_submit），拒绝不会删除账号，可随时重新审核。",
    admin_user_review_empty: "暂无待审核用户。",
    admin_user_review_error: "加载用户实名审核队列失败",
    admin_field_unnamed: "（未填写姓名）",
    admin_field_email: "邮箱：",
    admin_field_university: "学校：",
    admin_field_identity: "身份：",
    admin_field_orcid: "ORCID：",
    admin_field_academic_email: "学术邮箱：",
    admin_field_registered_at: "注册时间：",
    admin_approve_user_button: "通过实名审核",
    admin_processing: "处理中…",
    admin_reject_button: "拒绝",
    admin_reject_prompt: "请填写拒绝理由（可选）",
    admin_user_approve_error: "审核通过失败",
    admin_user_action_error: "操作失败",

    // ---- 管理后台：稿件审核队列 ----
    admin_queue_title: "审核队列",
    admin_queue_desc: "通过后会自动创建 Zenodo deposition、上传 PDF 并发布，注册正式 DOI。",
    admin_queue_empty: "队列为空。",
    admin_queue_error: "加载失败（可能不是管理员账号）",
    admin_approve_publish_button: "通过并发布到 Zenodo",
    admin_reject_reason_prompt: "请填写拒绝理由",
    admin_publish_error: "发布失败",
    admin_action_error: "操作失败",

    // ---- 管理后台：新版本待发布 ----
    pending_versions_heading: "新版本待发布",
    pending_versions_error: "加载新版本队列失败",
    pending_versions_line: "slug: {slug} · 待发布第 {n} 版 · {filename}",
    pending_versions_changelog_label: "修订说明：",
    pending_versions_publish_button: "发布该新版本到 Zenodo",

    // ---- 版本历史 ----
    version_history_heading: "版本历史",
    version_history_concept_doi_label: "Concept DOI（跨版本不变）：",
    version_history_version_prefix: "第 {n} 版 —",

    // ---- 预印本落地页 ----
    landing_withdrawn_notice: "本预印本已被作者撤稿。",
    landing_publishing: "发布中",
    landing_license_label: "许可证：",
    landing_official_publication_label: "正式发表：",
    landing_download_pdf: "下载 PDF",
    landing_abstract_heading: "摘要",
    landing_abstract_en_heading: "Abstract",
    landing_abstract_zh_heading: "摘要",
    landing_keywords_label: "关键词：",
    landing_archived_at: "归档于",

    // ---- 作者主页 ----
    author_paper_count: "共 {n} 篇已发布预印本",
    author_empty: "暂无匹配的已发布预印本。",

    // ---- 个人资料页 ----
    profile_title: "个人资料",
    profile_email_label: "邮箱（不可修改）",
    profile_verification_status_label: "实名审核状态：",
    profile_can_submit_yes: "可投稿",
    profile_can_submit_no: "暂不可投稿",
    profile_save_button: "保存修改",
    profile_save_loading: "保存中…",
    profile_save_success: "资料已更新",
    profile_save_error: "保存失败",
    profile_identity_changed_notice: "姓名或高校发生变化，账号已退回待审核状态，需管理员重新核实身份后才能投稿。",
    profile_change_password_heading: "修改密码",
    profile_old_password_label: "原密码",
    profile_new_password_label: "新密码（至少 8 位）",
    profile_confirm_password_label: "确认新密码",
    profile_password_mismatch: "两次输入的新密码不一致",
    profile_change_password_button: "修改密码",
    profile_change_password_loading: "修改中…",
    profile_change_password_success: "密码已修改",
    profile_change_password_error: "修改密码失败",
    verification_status_pending: "待审核",
    verification_status_approved: "已通过",
    verification_status_rejected: "未通过",
  },

  en: {
    nav_browse: "Browse",
    nav_showcase: "Academic News",
    nav_submit: "Submit",
    nav_login: "Log in",
    nav_register: "Register",
    nav_dashboard: "My Submissions",
    nav_profile: "Edit Profile",
    nav_logout: "Log Out",

    footer_p1_before:
      "ChangoPreprint is a preprint server for Malaysian Chinese international students; it is ",
    footer_p1_strong: "not a journal, and submissions are not peer-reviewed",
    footer_p1_after: ".",
    footer_p2:
      "Authors are responsible for the originality of their content; submissions are published under the CC BY 4.0 license by default.",
    footer_p3_before: "Files are permanently archived at ",
    footer_p3_after:
      " (operated by CERN), with DOIs registered via DataCite. Zenodo only provides archiving and DOI services and does not endorse the academic content.",
    footer_p4:
      "This site uses a real-name academic account system, completely independent from the MadeChango community account (madechango.com); the two do not share login or data.",

    // ---- Homepage Hero ----
    hero_title: "An Open Academic Preprint Platform for Malaysian Chinese International Students",
    hero_subtitle:
      "Get a permanent, citable DOI fast, claim academic priority, and get your research seen and cited sooner.",
    hero_search_placeholder: "Search titles, abstracts, or keywords…",
    hero_search_button: "Search",
    hero_cta_submit: "Submit Now",
    hero_cta_showcase: "Browse Academic News",

    // ---- Homepage stats strip ----
    stats_published_label: "Original Preprints Published Here",
    stats_showcase_label: "Curated News (from {n} platforms)",
    stats_doi_value: "Permanently Archived",
    stats_doi_label: "DOIs registered via Zenodo/DataCite",
    stats_free_value: "$0",
    stats_free_label: "Completely free, no publication fees",

    // ---- Homepage: academic news preview ----
    home_news_heading: "Academic News",
    home_news_more: "View All",

    // ---- Homepage: search results ----
    home_search_result_prefix: "Search results for “{q}”",
    home_search_clear: "Clear search",

    // ---- Homepage: why submit ----
    benefits_heading: "Why Choose ChangoPreprint",
    benefit_doi_title: "Fast, Permanent DOI",
    benefit_doi_desc:
      "Automatically published to Zenodo once approved — get a permanently citable DOI within minutes, no journal queue.",
    benefit_priority_title: "Claim Academic Priority",
    benefit_priority_desc:
      "A timestamped public record proves your ideas and results were first, protecting you from being scooped.",
    benefit_cite_title: "Easy to Cite & Share",
    benefit_cite_desc:
      "Standardized metadata plus a citable DOI make it easy for peers to find and cite your work, and to later link a formal journal publication.",
    benefit_free_title: "Free & Low Barrier",
    benefit_free_desc:
      "Completely free for Malaysian Chinese international students — no publication fees. Open to undergrads, graduate students, and faculty alike.",

    // ---- Homepage: latest preprints ----
    home_title: "Latest Preprints",
    home_desc:
      "Non-peer-reviewed academic preprints. Once published, each receives a citable DOI registered via Zenodo/DataCite.",
    home_empty: "No published preprints yet.",
    home_prev: "Previous",
    home_next: "Next",
    home_page: "Page {page} of {pages}",

    card_stats: "{views} views · {downloads} downloads",

    // ---- Academic News (curated external preprints) ----
    showcase_title: "Academic News",
    showcase_desc:
      "Curated academic news from major preprint platforms such as arXiv, SSRN, and bioRxiv. Reposted from the original platforms' public information; these are not submissions to this site and are not indexed or assigned a DOI here. Click \"Read Original\" for the full content.",
    showcase_empty: "No news yet, please check back later.",
    showcase_source_prefix: "Reposted from {source}",
    showcase_read_original: "Read Original",
    showcase_authors_more: "et al.",

    login_title: "Log in to ChangoPreprint",
    login_desc:
      "This site uses a real-name academic account system, completely independent from the MadeChango community account.",
    login_email_label: "Email",
    login_password_label: "Password",
    login_submit: "Log in",
    login_submit_loading: "Logging in…",
    login_error_default: "Login failed",

    register_title: "Register a ChangoPreprint Account",
    register_desc:
      "Submissions require real-name academic verification: please provide your legal name and university; an ORCID is recommended.",
    register_email_label: "Email *",
    register_password_label: "Password * (at least 8 characters)",
    register_fullname_label: "Legal Name *",
    register_university_label: "University *",
    register_university_placeholder: "e.g. University of Malaya",
    register_student_type_label: "Status",
    register_student_type_placeholder: "Please select",
    register_student_type_undergrad: "Undergraduate",
    register_student_type_master: "Master's Student",
    register_student_type_phd: "PhD Student",
    register_student_type_faculty: "Faculty / Staff",
    register_student_type_other: "Other",
    register_orcid_label: "ORCID (recommended)",
    register_academic_email_label: "Academic Email (helps manual verification)",
    register_submit: "Register",
    register_submit_loading: "Submitting…",
    register_error_default: "Registration failed",
    register_success_title: "Registration Successful",
    register_success_body:
      "Your real-name profile has been submitted and needs admin approval (verification_status: pending) before you can submit preprints. Redirecting to the login page…",

    submit_title: "Submit to ChangoPreprint",
    submit_title_zh_label: "Chinese Title",
    submit_title_en_label: "English Title",
    submit_title_hint: "At least one of the Chinese or English title is required",
    submit_abstract_zh_label: "Chinese Abstract",
    submit_abstract_en_label: "English Abstract",
    submit_language_label: "Language",
    submit_language_zh: "Chinese",
    submit_language_en: "English",
    submit_language_bilingual: "Bilingual",
    submit_subject_label: "Subject Area",
    submit_subject_placeholder: "e.g. Education / Computer Science",
    submit_keywords_label: "Keywords (comma separated)",
    submit_license_label: "License",
    license_cc_by: "CC BY 4.0 (default, recommended)",
    license_cc_by_sa: "CC BY-SA 4.0",
    license_cc_by_nc: "CC BY-NC 4.0",
    submit_authors_heading: "Authors",
    author_name_label: "Name *",
    author_affiliation_label: "Affiliation",
    author_orcid_label: "ORCID",
    author_corresponding_label: "Corresponding Author",
    add_author_button: "+ Add Author",
    create_draft_button: "Next: Upload PDF",
    create_draft_loading: "Creating…",
    submit_error_create_draft: "Failed to create draft",
    upload_pdf_heading: "Upload Main Preprint PDF",
    upload_submit_button: "Upload and Submit for Review",
    upload_submit_loading: "Uploading…",
    submit_error_upload: "Upload/submission failed",
    submit_done_title: "Submitted for Review",
    submit_done_body_before: "Submission ",
    submit_done_body_after:
      " has entered the review queue. Once approved by an administrator, it will be automatically published to Zenodo with a DOI. You can track progress on the \"My Submissions\" page.",
    view_my_submissions_button: "View My Submissions",

    dashboard_title: "My Submissions",
    dashboard_error: "Failed to load, please log in again",
    dashboard_empty_before: "No submissions yet, go ",
    dashboard_empty_link: "submit",
    dashboard_empty_after: " now.",
    dashboard_view_landing: "View Landing Page",
    status_draft: "Draft",
    status_submitted: "Submitted, Pending Review",
    status_under_review: "Publishing (syncing with Zenodo)",
    status_published: "Published",
    status_rejected: "Rejected",
    status_withdrawn: "Withdrawn",

    published_withdraw_button: "Withdraw",
    published_link_doi_button: "Link Journal DOI",
    published_upload_version_button: "Upload New Version",
    published_journal_doi_linked: "Linked journal DOI: {doi}",
    published_pending_version_hint: "Version {n} uploaded, pending admin review for Zenodo publication",
    published_withdrawal_note_label: "Withdrawal note: ",
    published_withdraw_placeholder:
      "Withdrawal note (required, will be shown publicly on the landing page)",
    published_withdraw_confirm: "Confirm Withdrawal",
    published_doi_placeholder: "Official journal DOI, e.g. 10.1000/xyz123",
    published_submit: "Submit",
    published_changelog_placeholder: "Changelog (optional)",
    published_upload: "Upload",
    published_withdraw_failed: "Withdrawal failed",
    published_link_failed: "Linking failed",
    published_upload_failed: "Upload failed",
    published_version_uploaded_success:
      "New version uploaded, pending admin review for Zenodo publication",

    admin_user_review_heading: "User Identity Verification",
    admin_user_review_desc:
      "Once approved, the user can submit preprints (can_submit). Rejecting does not delete the account and can be re-reviewed anytime.",
    admin_user_review_empty: "No users pending review.",
    admin_user_review_error: "Failed to load user verification queue",
    admin_field_unnamed: "(Name not provided)",
    admin_field_email: "Email: ",
    admin_field_university: "University: ",
    admin_field_identity: "Status: ",
    admin_field_orcid: "ORCID: ",
    admin_field_academic_email: "Academic Email: ",
    admin_field_registered_at: "Registered: ",
    admin_approve_user_button: "Approve Verification",
    admin_processing: "Processing…",
    admin_reject_button: "Reject",
    admin_reject_prompt: "Please enter a reason for rejection (optional)",
    admin_user_approve_error: "Approval failed",
    admin_user_action_error: "Operation failed",

    admin_queue_title: "Review Queue",
    admin_queue_desc:
      "Once approved, a Zenodo deposition will be created automatically, the PDF uploaded and published, registering an official DOI.",
    admin_queue_empty: "Queue is empty.",
    admin_queue_error: "Failed to load (this account may not be an admin)",
    admin_approve_publish_button: "Approve and Publish to Zenodo",
    admin_reject_reason_prompt: "Please enter a rejection reason",
    admin_publish_error: "Publishing failed",
    admin_action_error: "Operation failed",

    pending_versions_heading: "New Versions Pending Publication",
    pending_versions_error: "Failed to load pending versions queue",
    pending_versions_line: "slug: {slug} · Version {n} pending · {filename}",
    pending_versions_changelog_label: "Changelog: ",
    pending_versions_publish_button: "Publish This Version to Zenodo",

    version_history_heading: "Version History",
    version_history_concept_doi_label: "Concept DOI (unchanged across versions): ",
    version_history_version_prefix: "Version {n} —",

    landing_withdrawn_notice: "This preprint has been withdrawn by the author(s).",
    landing_publishing: "Publishing",
    landing_license_label: "License: ",
    landing_official_publication_label: "Formally Published: ",
    landing_download_pdf: "Download PDF",
    landing_abstract_heading: "Abstract",
    landing_abstract_en_heading: "Abstract",
    landing_abstract_zh_heading: "摘要",
    landing_keywords_label: "Keywords: ",
    landing_archived_at: "Archived at",

    author_paper_count: "{n} published preprint(s) in total",
    author_empty: "No matching published preprints.",

    profile_title: "Profile",
    profile_email_label: "Email (cannot be changed)",
    profile_verification_status_label: "Verification status: ",
    profile_can_submit_yes: "Can submit",
    profile_can_submit_no: "Cannot submit yet",
    profile_save_button: "Save Changes",
    profile_save_loading: "Saving…",
    profile_save_success: "Profile updated",
    profile_save_error: "Failed to save",
    profile_identity_changed_notice:
      "Your name or university has changed. Your account has been moved back to pending review and needs admin re-verification before you can submit.",
    profile_change_password_heading: "Change Password",
    profile_old_password_label: "Current Password",
    profile_new_password_label: "New Password (at least 8 characters)",
    profile_confirm_password_label: "Confirm New Password",
    profile_password_mismatch: "The new passwords do not match",
    profile_change_password_button: "Change Password",
    profile_change_password_loading: "Changing…",
    profile_change_password_success: "Password changed successfully",
    profile_change_password_error: "Failed to change password",
    verification_status_pending: "Pending Review",
    verification_status_approved: "Approved",
    verification_status_rejected: "Rejected",
  },
};
