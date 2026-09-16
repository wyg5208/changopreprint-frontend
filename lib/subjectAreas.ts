// 学科领域受控词表（下拉选择用）。
//
// 背景：投稿表单的"学科领域"原来是自由文本输入框，容易出现同一学科
// 几十种不同写法，改成受控词表下拉选择（主领域必填 + 次领域可选，
// 次领域不能和主领域相同）。
//
// 这份列表是后端 changopreprint/backend/cp_app/core/subject_areas.py
// 的手工同步副本（本站没有引入 next-intl 之类的重依赖来做单一数据源，
// 词典本身也是手工维护两份中英文，这里延续同样的约定）。改动学科列表
// 时两边要一起改，value 需要完全一致（它是存库字段，不是展示文案）。
export type SubjectAreaOption = {
  value: string;
  label_zh: string;
  label_en: string;
};

export const SUBJECT_AREAS: SubjectAreaOption[] = [
  { value: "mathematics", label_zh: "数学", label_en: "Mathematics" },
  { value: "physics", label_zh: "物理学", label_en: "Physics" },
  { value: "chemistry", label_zh: "化学", label_en: "Chemistry" },
  {
    value: "earth_environmental_science",
    label_zh: "地球与环境科学",
    label_en: "Earth & Environmental Sciences",
  },
  { value: "biology", label_zh: "生物学", label_en: "Biology" },
  {
    value: "medicine_health",
    label_zh: "医学与健康科学",
    label_en: "Medicine & Health Sciences",
  },
  { value: "computer_science", label_zh: "计算机科学", label_en: "Computer Science" },
  { value: "engineering", label_zh: "工程学", label_en: "Engineering" },
  { value: "materials_science", label_zh: "材料科学", label_en: "Materials Science" },
  {
    value: "astronomy_space_science",
    label_zh: "天文学与空间科学",
    label_en: "Astronomy & Space Science",
  },
  {
    value: "agricultural_science",
    label_zh: "农业科学",
    label_en: "Agricultural Sciences",
  },
  { value: "statistics", label_zh: "统计学", label_en: "Statistics" },
  { value: "economics", label_zh: "经济学", label_en: "Economics" },
  { value: "finance", label_zh: "金融学", label_en: "Finance" },
  {
    value: "management_business",
    label_zh: "管理学与商科",
    label_en: "Management & Business",
  },
  { value: "law", label_zh: "法学", label_en: "Law" },
  {
    value: "political_science_public_admin",
    label_zh: "政治学与公共管理",
    label_en: "Political Science & Public Administration",
  },
  { value: "sociology", label_zh: "社会学", label_en: "Sociology" },
  { value: "psychology", label_zh: "心理学", label_en: "Psychology" },
  { value: "anthropology", label_zh: "人类学", label_en: "Anthropology" },
  { value: "education", label_zh: "教育学", label_en: "Education" },
  {
    value: "communication_media",
    label_zh: "传播学与新闻学",
    label_en: "Communication & Media Studies",
  },
  {
    value: "linguistics_literature",
    label_zh: "语言学与文学",
    label_en: "Linguistics & Literature",
  },
  { value: "history", label_zh: "历史学", label_en: "History" },
  { value: "philosophy", label_zh: "哲学", label_en: "Philosophy" },
  { value: "arts", label_zh: "艺术学", label_en: "Arts" },
  { value: "other", label_zh: "其它", label_en: "Other" },
];

const _BY_VALUE: Record<string, SubjectAreaOption> = SUBJECT_AREAS.reduce(
  (acc, item) => ({ ...acc, [item.value]: item }),
  {} as Record<string, SubjectAreaOption>
);

/** 按当前语言把存库的 value 映射成展示文案；找不到时原样返回
 * （兼容上线前遗留的自由文本数据，不会直接消失或报错）。 */
export function subjectAreaLabel(value: string, locale: "zh" | "en"): string {
  if (!value) return "";
  const item = _BY_VALUE[value];
  if (!item) return value;
  return locale === "en" ? item.label_en : item.label_zh;
}
