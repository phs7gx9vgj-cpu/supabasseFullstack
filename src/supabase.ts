// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Kiểm tra biến môi trường
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Thiếu biến môi trường Supabase!');
  console.log('VITE_SUPABASE_URL:', supabaseUrl || 'Không có');
  console.log('VITE_SUPABASE_ANON_KEY có tồn tại:', !!supabaseAnonKey);
}

// Tạo client Supabase - KHÔNG cần Database type nếu không có
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hàm kiểm tra kết nối
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('cart_items').select('count').limit(1);
    
    if (error) {
      console.error('❌ Kết nối Supabase thất bại:', error.message);
      return false;
    }
    
    console.log('✅ Kết nối Supabase thành công!');
    return true;
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error);
    return false;
  }
};