
export type Category = string;

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'CARD' | 'COD' | 'BKASH';

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  bkashTransactionId?: string;
}

export type ViewState = 'HOME' | 'SHOP' | 'ADMIN' | 'BLOG' | 'TRACK_ORDER' | 'LOGIN' | 'REGISTER' | 'USER_DASHBOARD' | 'VERIFY_OTP';

export type UserRole = 'SUPER_ADMIN' | 'SHOP_ADMIN' | 'CUSTOMER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string; // In a real app, this would be hashed
}

export interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  fromEmail: string;
}

export interface CheckoutConfig {
    enableBkash: boolean;
    bkashNumber: string;
    bkashInstructions: string;
}

export interface HeroSlide {
    image: string;
    title: string;
    subtitle: string;
    cta: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    comment: string;
    rating: number;
}

export interface ContactInfo {
    email: string;
    phone: string;
    facebook: string;
    instagram: string;
    twitter: string;
}

export interface FeaturedCategory {
    name: string;
    image: string;
    filterValue: string; // The category to filter by in SHOP view
}

export interface USPItem {
    text: string;
    icon: 'TRUCK' | 'SHIELD' | 'REFRESH' | 'CROWN';
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
    author: string;
}

export interface Order {
    id: string;
    date: string;
    details: CheckoutDetails;
    items: CartItem[];
    total: number;
    discountApplied?: number;
    finalTotal: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Coupon {
    code: string;
    discountPercent: number;
    isActive: boolean;
}

export interface ProductHighlights {
    showShipping: boolean;
    shippingText: string;
    showWarranty: boolean;
    warrantyText: string;
}

export interface SiteConfig {
  headerTitle: string;
  logo: string;
  footerText: string;
  smtp: SmtpConfig;
  checkout: CheckoutConfig;
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  contactInfo: ContactInfo;
  showMarquee: boolean;
  featuredCategories: FeaturedCategory[];
  usps: USPItem[];
  showTopBar: boolean;
  topBarText: string;
  copyrightText: string;
  coupons: Coupon[];
  productHighlights: ProductHighlights;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  visitors: number;
}