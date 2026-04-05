import api from './axios';
import axios from 'axios';
import type {
    User,
    Category,
    Product,
    Cart,
    Order,
    Address,
    PaginatedResponse,
} from '../types/models';

// ── Auth ────────────────────────────────────────────────────────────────

export async function getCsrfCookie(): Promise<void> {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
}

export async function register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}): Promise<{ data: User }> {
    const res = await api.post<{ data: User }>('/auth/register', data);
    return res.data;
}

export async function login(data: {
    email: string;
    password: string;
}): Promise<{ data: User }> {
    const res = await api.post<{ data: User }>('/auth/login', data);
    return res.data;
}

export async function logout(): Promise<void> {
    await api.post('/auth/logout');
}

export async function getUser(): Promise<User> {
    const res = await api.get<{ data: User }>('/auth/user');
    return res.data.data;
}

// ── Categories ──────────────────────────────────────────────────────────

export async function getCategories(
    params?: Record<string, string | number | boolean>,
): Promise<Category[]> {
    const res = await api.get<{ data: Category[] }>('/categories', { params });
    return res.data.data;
}

export async function getCategory(slug: string): Promise<Category> {
    const res = await api.get<{ data: Category }>(`/categories/${slug}`);
    return res.data.data;
}

// ── Products ────────────────────────────────────────────────────────────

export async function getProducts(
    params?: Record<string, string | number | boolean>,
): Promise<PaginatedResponse<Product>> {
    const res = await api.get<PaginatedResponse<Product>>('/products', { params });
    return res.data;
}

export async function getProduct(slug: string): Promise<Product> {
    const res = await api.get<{ data: Product }>(`/products/${slug}`);
    return res.data.data;
}

// ── Cart ────────────────────────────────────────────────────────────────

export async function getCart(): Promise<Cart> {
    const res = await api.get<{ data: Cart }>('/cart');
    return res.data.data;
}

export async function addToCart(data: {
    product_uuid: string;
    quantity: number;
}): Promise<Cart> {
    const res = await api.post<{ data: Cart }>('/cart/items', data);
    return res.data.data;
}

export async function updateCartItem(
    uuid: string,
    data: { quantity: number },
): Promise<Cart> {
    const res = await api.patch<{ data: Cart }>(`/cart/items/${uuid}`, data);
    return res.data.data;
}

export async function removeCartItem(uuid: string): Promise<void> {
    await api.delete(`/cart/items/${uuid}`);
}

// ── Orders ──────────────────────────────────────────────────────────────

export async function getOrders(
    params?: Record<string, string | number>,
): Promise<PaginatedResponse<Order>> {
    const res = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return res.data;
}

export async function createOrder(data: {
    shipping_address_id: string;
    billing_address_id?: string;
    notes?: string;
}): Promise<Order> {
    const res = await api.post<{ data: Order }>('/orders', data);
    return res.data.data;
}

export async function getOrder(uuid: string): Promise<Order> {
    const res = await api.get<{ data: Order }>(`/orders/${uuid}`);
    return res.data.data;
}

// ── Addresses ───────────────────────────────────────────────────────────

export async function getAddresses(): Promise<Address[]> {
    const res = await api.get<{ data: Address[] }>('/addresses');
    return res.data.data;
}

export async function createAddress(
    data: Omit<Address, 'uuid' | 'is_default'> & { is_default?: boolean },
): Promise<Address> {
    const res = await api.post<{ data: Address }>('/addresses', data);
    return res.data.data;
}

export async function updateAddress(
    uuid: string,
    data: Partial<Omit<Address, 'uuid'>>,
): Promise<Address> {
    const res = await api.patch<{ data: Address }>(`/addresses/${uuid}`, data);
    return res.data.data;
}

export async function deleteAddress(uuid: string): Promise<void> {
    await api.delete(`/addresses/${uuid}`);
}
