// Shared gemstone types — import from here instead of redefining in every component

export interface GemstoneSpec {
    label: string;
    value: string;
}

export interface GemstoneMedia {
    id?: number;
    file_path: string;
    type: 'image' | 'video';
    display_order?: number;
}

export interface Gemstone {
    id: number;
    name: string;
    slug: string;
    description: string;
    origin?: string;
    category: string;
    inquiry_only?: boolean;
    display_order?: number;
    specs: GemstoneSpec[];
    media: GemstoneMedia[];
}
