const API_BASE_URL = "http://localhost:5000"; 

export const ProductAPI = {
    async fetchProduct() {
        try {
          const response = await fetch(`${API_BASE_URL}/products`, {
            method: "GET",
                headers: {
                    "Content-Type": "appliproduction/json",
                },
          });
          if(!response.ok) {
            throw new Error("Failed to fetch Products")
          }
          const result = await response.json();
            if (Array.isArray(result)) return result;
            if (result && Array.isArray(result.data)) {
                return result.data.map((product: any) => ({
                    id: product.id,
                    category_id: product.category_id,
                    name: product.name,
                    description: product.description,
                    image: product.img_name,
                    price: product.price,
                    stock: product.stock
                }));
            }
            return [];
        } catch (error :any) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    async fetchById(id: number | string) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch product by id");
            }
            const result = await response.json();
            if (result && result.data) {
                const product = result.data;
                return {
                    id: product.id,
                    category_id: product.category_id,
                    name: product.name,
                    description: product.description,
                    image: product.img_name,
                    price: product.price,
                    stock: product.stock,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error fetching product by id:", error);
            throw error;
        }
    },

    async fetchByName (name: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/name/${encodeURIComponent(name)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch product by name");
            }
            const result = await response.json();
            if (result && result.data) {
                const product = result.data;
                return {
                    id: product.id,
                    category_id: product.category_id,
                    name: product.name,
                    description: product.description,
                    image: product.img_name,
                    price: product.price,
                    stock: product.stock,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error fetching product by name:", error);
            throw error;
        }
    },

    
    async create (product: {
        id: number,
        category_id: number,
        name: string,
        description: string,
        image: string,
        price: number,
        stock: number,
    }) {
        try {
            const backendProduct = {
                id: product.id,
                category_id: product.category_id,
                name: product.name,
                description: product.description,
                img_name: product.image,
                price: product.price,
                stock: product.stock
            };
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(backendProduct),
            });
            if (!response.ok) {
                throw new Error("Failed to create product");
            }
            const result = await response.json();
            if (result && result.data) {
                const product = result.data;
                return {
                    id: product.id,
                    category_id: product.category_id,
                    name: product.name,
                    description: product.description,
                    image: product.img_name,
                    price: product.price,
                    stock: product.stock,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async update  (
        id: number | string,
        product: {
            category_id?: number,
            name?: string;
            description?: string;
            active?: boolean;
            image?: string;
            price?: number;
            stock?: number;
        }
    ) {
        try {
            const backendProduct: any = {
                ...product,
            };
            if (backendProduct.image !== undefined) {
                backendProduct.img_name = backendProduct.image;
                delete backendProduct.image;
            }
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(backendProduct),
            });
            if (!response.ok) {
                throw new Error("Failed to update products");
            }
            const result = await response.json();
            if (result && result.data) {
                const product = result.data;
                return {
                    id: product.id,
                    category_id: product.category_id,
                    name: product.name,
                    description: product.description,
                    image: product.img_name,
                    price: product.price,
                    stock: product.stock
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error updating category:", error);
            throw error;
        }
    },

    async delete(id: number | string){
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete products");
            }
            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }
}