import siteConfig from "./src/lib/config";
const config = siteConfig({
  title: "determine",
  prologue: "记录思考，\n也记录沿途。",
  author: {name: "determine", email: "determine@sjtu.edu.cn", link: "https://github.com/determine123"},
  description: "上海交通大学硕士在读，成都理工大学本科。Agent、AI Infra、学习与骑行记录。",
  copyright: {type: "CC BY-NC-ND 4.0", year: "2026"},
  timezone: "Asia/Shanghai",
  i18n: {locales: ["zh-cn"], defaultLocale: "zh-cn"},
  pagination: {note: 12, jotting: 24},
  heatmap: {unit: "day", weeks: 20},
  feed: {section: ["note"], limit: 30},
  latest: ["note"]
});
export const monolocale = true;
export default config;
