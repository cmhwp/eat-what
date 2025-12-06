"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Food } from "@/lib/types";
import { parseMarkdown, generateTemplate } from "@/lib/markdown-parser";

interface FoodManagerProps {
  foods: Food[];
  onAdd: (name: string, category?: string, description?: string) => boolean;
  onRemove: (id: string) => void;
  onReset: () => void;
  onImport: (foods: Food[]) => void;
}

export function FoodManager({
  foods,
  onAdd,
  onRemove,
  onReset,
  onImport,
}: FoodManagerProps) {
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (onAdd(inputValue)) {
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsedFoods = parseMarkdown(content);
      if (parsedFoods.length > 0) {
        onImport(parsedFoods);
      }
    };
    reader.readAsText(file);

    // 重置 input 以便再次上传同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateTemplate();
    const blob = new Blob([template], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "食物列表模板.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 按分类分组
  const groupedFoods = foods.reduce(
    (acc, food) => {
      const category = food.category || "未分类";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(food);
      return acc;
    },
    {} as Record<string, Food[]>
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">管理食物列表</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 添加食物 */}
        <div className="flex gap-2">
          <Input
            placeholder="输入食物名称..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleAdd} disabled={!inputValue.trim()}>
            添加
          </Button>
        </div>

        {/* Markdown 上传 */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            上传 Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="flex-1"
          >
            下载模板
          </Button>
        </div>

        {/* 食物列表（按分类） */}
        <div className="max-h-64 overflow-y-auto space-y-3">
          {Object.entries(groupedFoods).map(([category, categoryFoods]) => (
            <div key={category}>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {category}
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryFoods.map((food) => (
                  <span
                    key={food.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                    title={food.description}
                  >
                    {food.name}
                    <button
                      onClick={() => onRemove(food.id)}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {foods.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            还没有食物，添加一些或上传 Markdown 文件吧！
          </p>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full"
        >
          重置为默认列表
        </Button>
      </CardContent>
    </Card>
  );
}
