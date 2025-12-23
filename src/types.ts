// src/types.ts
export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  created_at?: string; // Thêm trường này vì Supabase có
}

export interface ProductInput {
  name: string;
  price: number | string;
  quantity: number | string;
}