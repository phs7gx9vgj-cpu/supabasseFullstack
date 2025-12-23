// src/api.ts
import { supabase } from './lib/supabaseClient';
import type { CartItemType, ProductInput } from './types';

// Lấy tất cả sản phẩm trong giỏ hàng
export const getCartItems = async (): Promise<CartItemType[]> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Lỗi trong getCartItems:', error);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (product: ProductInput): Promise<CartItemType> => {
  try {
    // Chuyển đổi kiểu dữ liệu
    const productData = {
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      quantity: typeof product.quantity === 'string' ? parseInt(product.quantity) : product.quantity
    };

    const { data, error } = await supabase
      .from('cart_items')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Lỗi trong addToCart:', error);
    throw error;
  }
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = async (id: number, quantity: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Lỗi cập nhật:', error);
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    throw error;
  }
};