"use client";

import { useState, useEffect } from "react";
import type { Food } from "@/lib/types";

const STORAGE_KEY = "eat-what-foods";

const DEFAULT_FOODS: Food[] = [
  { id: "1", name: "火锅", category: "外卖", description: "适合聚餐，人均80" },
  { id: "2", name: "烧烤", category: "外卖", description: "夜宵首选" },
  { id: "3", name: "麻辣烫", category: "外卖", description: "便宜实惠" },
  { id: "4", name: "炒菜", category: "食堂", description: "家常味道" },
  { id: "5", name: "饺子", category: "食堂", description: "北方经典" },
  { id: "6", name: "面条", category: "食堂", description: "快速出餐" },
  { id: "7", name: "汉堡", category: "外卖", description: "西式快餐" },
  { id: "8", name: "披萨", category: "外卖", description: "适合分享" },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useFoodStore() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载数据
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 兼容旧数据格式（纯字符串数组）
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === "string") {
            setFoods(
              parsed.map((name: string) => ({
                id: generateId(),
                name,
                category: "未分类",
              }))
            );
          } else {
            setFoods(parsed);
          }
        } else {
          setFoods(DEFAULT_FOODS);
        }
      } catch {
        setFoods(DEFAULT_FOODS);
      }
    } else {
      setFoods(DEFAULT_FOODS);
    }
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
    }
  }, [foods, isLoaded]);

  const addFood = (
    name: string,
    category: string = "未分类",
    description?: string
  ) => {
    const trimmedName = name.trim();
    if (trimmedName && !foods.some((f) => f.name === trimmedName)) {
      const newFood: Food = {
        id: generateId(),
        name: trimmedName,
        category,
        description,
      };
      setFoods((prev) => [...prev, newFood]);
      return true;
    }
    return false;
  };

  const removeFood = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const resetFoods = () => {
    setFoods(DEFAULT_FOODS);
  };

  const importFoods = (newFoods: Food[]) => {
    setFoods(newFoods);
  };

  return {
    foods,
    isLoaded,
    addFood,
    removeFood,
    resetFoods,
    importFoods,
  };
}
