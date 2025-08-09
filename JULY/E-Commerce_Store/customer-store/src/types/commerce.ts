export type Product = {
    id: number | string;
    name: string;
    price: number;
    image_url?: string;
    image?: string;
    stock?: number;
    [key: string]: any;
  };
  
  export type CartItem = {
    product: Product;
    quantity: number;
  };
  
  export type UserSummary = {
    id?: number;
    email?: string;
  } | null;
  
  export type Address = {
    address1: string;
    address2?: string;
    city: string; 
    country: string;
    postalCode?: string;
    phone: string;
    firstName?: string;
    lastName?: string;
  };