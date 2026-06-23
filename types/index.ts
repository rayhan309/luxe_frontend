export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  avatar?: string;
  addresses?: Address[];
  wishlist?: string[];
  created_at: string;
  updated_at: string;
}

export interface Address {
  id?: string;
  label: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
  children?: Category[];
  is_active: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_desc?: string;
  category_id: string;
  category?: Category;
  price: number;
  compare_price?: number;
  images: string[];
  thumbnail: string;
  sku: string;
  stock: number;
  tags?: string[];
  variants?: ProductVariant[];
  attributes?: Record<string, string[]>;
  status: 'active' | 'inactive' | 'draft';
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  average_rating: number;
  review_count: number;
  sold_count: number;
  weight?: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  product?: Product;
  name: string;
  image: string;
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  variant_id?: string;
  name: string;
  image: string;
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  quantity: number;
  total: number;
}

export interface StatusHistory {
  status: string;
  note?: string;
  changed_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: OrderItem[];
  shipping_address: Address;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'cod' | 'online';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shipping_cost: number;
  discount: number;
  coupon_code?: string;
  tax: number;
  total: number;
  note?: string;
  tracking_number?: string;
  status_history: StatusHistory[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user?: User;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  is_verified: boolean;
  is_approved: boolean;
  helpful: number;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobile_image?: string;
  link?: string;
  button_text?: string;
  position: 'hero' | 'mid' | 'bottom';
  sort_order: number;
  is_active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount_amount: number;
  message: string;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  today_revenue: number;
  today_orders: number;
  average_order: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface ProductFilter {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  page?: number;
  limit?: number;
  ids?: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  short_desc?: string;
  category_id: string;
  price: number;
  compare_price?: number;
  images: string[];
  thumbnail?: string;
  sku: string;
  stock: number;
  low_stock_alert?: number;
  weight?: number;
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  meta_title?: string;
  meta_desc?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  current_password?: string;
  new_password?: string;
}

export interface AddToCartInput {
  product_id: string;
  variant_id?: string;
  quantity: number;
  attributes?: Record<string, string>;
}

export interface CreateOrderInput {
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
    attributes?: Record<string, string>;
  }[];
  shipping_address: {
    label: string;
    full_name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    is_default: boolean;
  };
  payment_method: 'cod' | 'online';
  coupon_code?: string;
  note?: string;
}

