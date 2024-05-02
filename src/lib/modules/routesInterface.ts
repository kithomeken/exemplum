export interface Routes_Interface {
    name: string,
    path: string;
    element: any;
    activeMenu?: string;
    caseSensitive?: boolean;
    meta?: {
        resource?: string;
        action?: string;
    };
}