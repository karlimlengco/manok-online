/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_CHANGELOG__: Array<{
    version: string;
    date: string;
    changes: Array<{
        type: 'added' | 'changed' | 'fixed' | 'removed';
        description: string;
    }>;
}>;
