
export type ProductVariant = {
  variantId: string;
  color: string;
  imageSrc: string;
  imageAlt: string;
  imageBackSrc?: string;
  imageBackAlt?: string;
  sizes: string[];
};

export type Product = {
  productId: string;
  name: string;
  price: string;
  variants: ProductVariant[];
};