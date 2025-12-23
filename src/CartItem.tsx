// src/components/CartItem.tsx
import React, { useState } from 'react';
import type { CartItemType } from './types';
import { updateCartItem, removeFromCart } from './api';

interface Props {
  item: CartItemType;
  onUpdate: () => void; // Callback để refresh danh sách
}

const CartItem: React.FC<Props> = ({ item, onUpdate }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await updateCartItem(item.id, newQuantity);
      setQuantity(newQuantity);
      onUpdate(); // Gọi callback để refresh danh sách
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Xóa "${item.name}" khỏi giỏ hàng?`)) {
      setIsUpdating(true);
      try {
        await removeFromCart(item.id);
        onUpdate(); // Gọi callback để refresh danh sách
      } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại!');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const totalPrice = item.price * quantity;

  return (
    <tr className="cart-item">
      <td>{item.name}</td>
      <td>{item.price.toLocaleString('vi-VN')} VND</td>
      <td>
        <div className="quantity-control">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            className="quantity-btn"
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="quantity-btn"
          >
            +
          </button>
        </div>
      </td>
      <td>{totalPrice.toLocaleString('vi-VN')} VND</td>
      <td>
        <button 
          onClick={handleRemove}
          className="remove-btn"
          disabled={isUpdating}
        >
          {isUpdating ? 'Đang xóa...' : '🗑️ Xóa'}
        </button>
      </td>
    </tr>
  );
};

export default CartItem;