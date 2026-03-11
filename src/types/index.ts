// src/types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Pricing {
    price: number;
    currency: string;
    planName: string;
    features: string[];
}

export interface Dashboard {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    growthRate: number;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
    status: number;
}