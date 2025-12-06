"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Food } from "@/lib/types";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

interface SpinWheelProps {
  foods: Food[];
}

export function SpinWheel({ foods }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Food | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const segmentAngle = foods.length > 0 ? 360 / foods.length : 360;

  const conicGradient = useMemo(() => {
    if (foods.length === 0)
      return "conic-gradient(#e5e5e5 0deg, #e5e5e5 360deg)";

    const segments = foods.map((_, index) => {
      const color = COLORS[index % COLORS.length];
      const start = index * segmentAngle;
      const end = (index + 1) * segmentAngle;
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from -90deg, ${segments.join(", ")})`;
  }, [foods, segmentAngle]);

  const spin = () => {
    if (isSpinning || foods.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + randomAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      const finalAngle = totalRotation % 360;
      const pointerAngle = (360 - finalAngle) % 360;
      const selectedIndex =
        Math.floor(pointerAngle / segmentAngle) % foods.length;
      setResult(foods[selectedIndex]);
      setShowDialog(true);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-6">
        {/* 指针 */}
        <div className="relative">
          <div
            className="absolute left-1/2 -top-2 z-10 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "24px solid #1f2937",
            }}
          />

          {/* 转盘 */}
          <div
            className="relative rounded-full shadow-xl border-4 border-gray-800"
            style={{
              width: 400,
              height: 400,
              background: conicGradient,
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            {/* 食物标签 */}
            {foods.map((food, index) => {
              const angle = index * segmentAngle + segmentAngle / 2;
              const radian = ((angle - 90) * Math.PI) / 180;
              const radius = 140;
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;

              return (
                <Tooltip key={food.id}>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute text-sm font-bold text-gray-800 whitespace-nowrap cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                      }}
                    >
                      {food.name}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-bold">{food.name}</div>
                      <div className="text-muted-foreground">
                        {food.category}
                      </div>
                      {food.description && (
                        <div className="mt-1">{food.description}</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* 中心圆 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md border-2 border-gray-300" />
          </div>
        </div>

        <Button
          size="lg"
          onClick={spin}
          disabled={isSpinning || foods.length === 0}
          className="text-lg px-8"
        >
          {isSpinning
            ? "转动中..."
            : foods.length === 0
              ? "请先添加食物"
              : "开始转动"}
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                今天吃
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-primary">
                {result?.name}
              </div>
              {result?.category && (
                <div className="mt-2 text-muted-foreground">
                  {result.category}
                </div>
              )}
              {result?.description && (
                <div className="mt-3 text-lg">{result.description}</div>
              )}
            </div>
            <Button onClick={() => setShowDialog(false)} className="w-full">
              好的！
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
