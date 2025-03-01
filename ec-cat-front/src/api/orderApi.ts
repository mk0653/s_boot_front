import { apiRequest } from './client';
import { Order, OrderStatus } from '../types';

// 全注文取得
export const fetchOrders = () => {
  return apiRequest<Order[]>({
    method: 'GET',
    url: '/orders',
  });
};

// 新規注文作成
export const createOrder = (data: {
  customerName: string;
  productName: string;
  quantity: number;
}) => {
  // Spring Bootコントローラー用にフォームデータ形式に変換
  const formData = new URLSearchParams();
  formData.append('customerName', data.customerName);
  formData.append('productName', data.productName);
  formData.append('quantity', data.quantity.toString());

  return apiRequest<Order>({
    method: 'POST',
    url: '/orders',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData,
  });
};

// 注文ステータス更新
export const updateOrderStatus = (id: number, status: OrderStatus) => {
  return apiRequest<Order>({
    method: 'POST',
    url: `/orders/${id}/status`,
    params: { status },
  });
};

// 注文削除
export const deleteOrder = (id: number) => {
  return apiRequest<void>({
    method: 'POST',
    url: `/orders/${id}/delete`,
  });
};