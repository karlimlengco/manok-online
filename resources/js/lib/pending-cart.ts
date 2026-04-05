const STORAGE_KEY = 'pending_cart_item';

export interface PendingCartItem {
    product_uuid: string;
    quantity: number;
}

export function setPendingCartItem(item: PendingCartItem): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
}

export function getPendingCartItem(): PendingCartItem | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as PendingCartItem;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function clearPendingCartItem(): void {
    localStorage.removeItem(STORAGE_KEY);
}
