import type { Food } from "./types";

/**
 * 解析 Markdown 格式的食物列表
 *
 * 支持的格式:
 * ## 分类名称
 * - 食物名称 | 描述信息
 * - 食物名称
 *
 * 或者简单列表:
 * - 食物名称 | 描述
 */
export function parseMarkdown(content: string): Food[] {
  const foods: Food[] = [];
  const lines = content.split("\n");
  let currentCategory = "未分类";

  for (const line of lines) {
    const trimmed = line.trim();

    // 检测分类标题 (## 开头)
    if (trimmed.startsWith("## ")) {
      currentCategory = trimmed.slice(3).trim();
      continue;
    }

    // 检测食物项 (- 或 * 开头)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemContent = trimmed.slice(2).trim();

      // 解析 "食物名称 | 描述" 格式
      const parts = itemContent.split("|").map((p) => p.trim());
      const name = parts[0];
      const description = parts[1];

      if (name) {
        foods.push({
          id: generateId(),
          name,
          category: currentCategory,
          description,
        });
      }
    }
  }

  return foods;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * 生成示例 Markdown 模板
 */
export function generateTemplate(): string {
  return `## 外卖
- 火锅 | 适合聚餐，人均80
- 烧烤 | 夜宵首选
- 麻辣烫 | 便宜实惠

## 食堂
- 炒菜 | 家常味道
- 饺子 | 北方经典
- 面条 | 快速出餐

## 自己做
- 煮面 | 简单快速
- 炒饭 | 消耗剩饭
`;
}
