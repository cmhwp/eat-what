"use client";

import { SpinWheel } from "@/components/spin-wheel";
import { FoodManager } from "@/components/food-manager";
import { useFoodStore } from "@/hooks/use-food-store";

export default function Home() {
  const { foods, isLoaded, addFood, removeFood, resetFoods, importFoods } =
    useFoodStore();

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">今天吃什么？</h1>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
          <SpinWheel foods={foods} />
          <FoodManager
            foods={foods}
            onAdd={addFood}
            onRemove={removeFood}
            onReset={resetFoods}
            onImport={importFoods}
          />
        </div>
      </div>
    </main>
  );
}
