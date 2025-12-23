import { useEffect, useState } from "react";

import type { CartItemType, ProductInput } from "./types";
import CartItem from "./CartItem";
import "./App.css";
import { testSupabaseConnection, } from "./lib/supabaseClient";
import { addToCart, getCartItems } from "./api";

function App() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [product, setProduct] = useState<ProductInput>({
    name: "",
    price: "",
    quantity: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);

  // Kiểm tra kết nối Supabase khi app khởi động
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testSupabaseConnection();
      setConnectionTested(true);
      
      if (!isConnected) {
        setError("Không thể kết nối đến Supabase. Kiểm tra API keys.");
      } else {
        fetchCart();
      }
    };
    
    checkConnection();
  }, []);

  // Lấy danh sách giỏ hàng
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCartItems();
      setCart(data);
    } catch (err: any) {
      setError(`Lỗi tải giỏ hàng: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Thêm sản phẩm
  const handleAddToCart = async () => {
    if (!product.name.trim() || !product.price) {
      setError("Vui lòng nhập tên và giá sản phẩm");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newItem = await addToCart(product);
      setCart(prev => [newItem, ...prev]); // Thêm lên đầu danh sách
      setProduct({ name: "", price: "", quantity: 1 });
      
      // Hiển thị thông báo thành công
      alert(`Đã thêm "${newItem.name}" vào giỏ hàng!`);
    } catch (err: any) {
      setError(`Lỗi thêm sản phẩm: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🛒 Giỏ Hàng Shopping Cart</h1>
      
      {!connectionTested ? (
        <div className="loading">Đang kiểm tra kết nối Supabase...</div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : (
        <>
          {/* Form thêm sản phẩm */}
          <div className="add-product-card">
            <h2>➕ Thêm sản phẩm mới</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Giá (VND)"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                min="0"
                step="1000"
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Số lượng"
                value={product.quantity}
                onChange={(e) => 
                  setProduct({ ...product, quantity: Number(e.target.value) || 1 })
                }
                min="1"
                disabled={loading}
              />
              <button 
                onClick={handleAddToCart} 
                disabled={loading || !product.name || !product.price}
                className="add-btn"
              >
                {loading ? "Đang thêm..." : "Thêm vào giỏ"}
              </button>
            </div>
          </div>

          {/* Hiển thị giỏ hàng */}
          <div className="cart-section">
            <div className="cart-header">
              <h2>📦 Sản phẩm trong giỏ ({cart.length})</h2>
              <button onClick={fetchCart} disabled={loading}>
                🔄 Làm mới
              </button>
            </div>

            {loading && cart.length === 0 ? (
              <div className="loading">Đang tải giỏ hàng...</div>
            ) : cart.length === 0 ? (
              <div className="empty-cart">
                <p>Giỏ hàng trống. Hãy thêm sản phẩm đầu tiên!</p>
              </div>
            ) : (
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onUpdate={fetchCart}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}><strong>Tổng cộng:</strong></td>
                    <td colSpan={2}>
                      <strong>
                        {cart.reduce((total, item) => 
                          total + (item.price * item.quantity), 0
                        ).toLocaleString()} VND
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Thông tin Supabase */}
          <div className="info-box">
            <p>
              <small>
                ✅ Đang sử dụng Supabase | 
                Project: {import.meta.env.VITE_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '')}
              </small>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;