// src/api/productApi.ts
import http from "./http";

export type Product = {
  id: number;
  name: string;
  nameEn?: string; // Tên sản phẩm tiếng Anh
  price: number;
  description?: string;
  imageUrl?: string;
  brand?: string;
  category?: string;
  stock?: number;
  discountPercent?: number;
  flashSaleEndAt?: string;
  averageRating?: number;
  ratingCount?: number;
  ratingSum?: number;
  createdAt?: string;
  status?: string;
  // thêm field khác nếu có
};

export const productApi = {
  async getProductsPage(params?: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    newOnly?: boolean;
    page?: number;
    size?: number;
  }) {
    const res = await http.get("/products", { params });
    return res.data;
  },

  // Lấy 1 sản phẩm
  getOne(id: number) {
    return http.get(`/products/${id}`);
  },

  // Gợi ý tìm kiếm
  async suggest(q: string) {
    const res = await http.get("/products/suggest", {
      params: { q },
    });
    return res.data; // backend đang trả array
  },

  async getCategories(): Promise<string[]> {
    const res = await http.get("/products/categories");
    return Array.isArray(res.data) ? res.data : [];
  },
};
