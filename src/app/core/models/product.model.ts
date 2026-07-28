// Product models
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  imageUrl: string;
  category: string;
  active: boolean;
  images?: ProductImage[];
  new?: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  stock?: number;
  imageUrl?: string;
  category?: string;
  isNew?: boolean;
  active?: boolean;
}

// User models
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  document?: string;
  active: boolean;
  roles: string[];
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  document?: string;
}

export interface UserAdminUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  document?: string;
  roles?: string[];
  active?: boolean;
}

export interface UserAdminCreateRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  document?: string;
  roles?: string[];
  active?: boolean;
}

// Address models
export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface AddressRequest {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

// Payment Method models
export type PaymentMethodType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';

export interface PaymentMethod {
  id: number;
  type: PaymentMethodType;
  cardLast4?: string;
  cardBrand?: string;
  isDefault: boolean;
}

export interface PaymentMethodRequest {
  type: PaymentMethodType;
  cardLast4?: string;
  cardBrand?: string;
  isDefault?: boolean;
}

// Order models
export type OrderStatus = 'PENDING' | 'PAID' | 'DENIED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface Order {
  id: number;
  status: OrderStatus;
  subTotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderRequest {
  shippingAddressId: number;
  paymentMethodId: number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

// Auth models
export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role?: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// FAQ models
export interface Faq {
  id: number;
  question: string;
  answer: string;
  active: boolean;
}

export interface FaqRequest {
  question: string;
  answer: string;
  active?: boolean;
}

// Cart (local state, not from API)
export interface CartItem {
  product: Product;
  quantity: number;
}
