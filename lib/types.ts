export interface Food {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface FoodCategory {
  name: string;
  foods: Food[];
}
