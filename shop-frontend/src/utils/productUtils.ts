import { Product } from "../api/productApi";

/**
 * Lấy tên sản phẩm theo ngôn ngữ
 * @param product - Product object
 * @param lang - Ngôn ngữ hiện tại ("vi" | "en")
 * @returns Tên sản phẩm theo ngôn ngữ
 */
export const getProductName = (
  product: Product | null | undefined,
  lang: string = "vi"
): string => {
  if (!product) return "";
  if (lang === "en" && product.nameEn) {
    return product.nameEn;
  }
  return product.name || "";
};
