// 注文ステータス型
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED';

// 注文モデル
export interface Order {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  status: OrderStatus;
}

// APIレスポンス型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// ページネーション型
export interface PaginationParams {
  page: number;
  size: number;
}

// ナビゲーション
export interface NavItem {
  title: string;
  path: string;
  icon: string;
}

// サイドバー
export interface SidebarItem { 
    title: string;
    icon: string;
    children: NavItem[];
}
