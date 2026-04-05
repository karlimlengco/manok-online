export interface User {
    uuid: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    created_at: string;
}

export interface Category {
    uuid: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    sort_order: number;
    products_count?: number;
}

export interface Product {
    uuid: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compare_price: number | null;
    stock: number;
    breed: string;
    age_months: number | null;
    weight_kg: number | null;
    color: string | null;
    status: 'active' | 'draft' | 'sold';
    is_featured: boolean;
    category?: Category;
    images: ProductImage[];
    created_at: string;
}

export interface ProductImage {
    uuid: string;
    path: string;
    alt: string | null;
    sort_order: number;
}

export interface CartItem {
    uuid: string;
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Cart {
    uuid: string;
    items: CartItem[];
    items_count: number;
    total: number;
}

export interface Address {
    uuid: string;
    label: string | null;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string | null;
    is_default: boolean;
}

export interface OrderItem {
    uuid: string;
    product_name: string;
    product_slug: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Order {
    uuid: string;
    order_number: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shipping_fee: number;
    total: number;
    shipping_address: Record<string, string>;
    billing_address: Record<string, string> | null;
    notes: string | null;
    items?: OrderItem[];
    paid_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
    created_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}
