import { createClient } from '@supabase/supabase-js';

// Kiểm tra biến môi trường
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Thiếu biến môi trường Supabase!');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey?.substring(0, 20) + '...');
}

// Tạo client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

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