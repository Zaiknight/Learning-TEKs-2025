const API_BASE_URL = "http://localhost:5000"; 

export const ProductAPI = {
    async fetchProduct() {
        try {
          const response = await fetch(`${API_BASE_URL}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
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

    async create(product: {
        id: number,
        category_id: number,
        name: string,
        description: string,
        img_name: File, 
        price: number,
        stock: number,
    }) {
        try {
            const formData = new FormData();
            formData.append("id", String(product.id));
            formData.append("category_id", String(product.category_id));
            formData.append("name", product.name);
            formData.append("description", product.description);
            formData.append("price", String(product.price));
            formData.append("stock", String(product.stock));
            formData.append("image", product.img_name); 
    
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Failed to create product");
            }
    
            const result = await response.json();
    
            if (result && result.data) {
                const p = result.data;
                return {
                    id: p.id,
                    category_id: p.category_id,
                    name: p.name,
                    description: p.description,
                    image: p.img_name,
                    price: p.price,
                    stock: p.stock,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error creating product:", error);
            throw error;
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

    async update  (
        id: number | string,
        product: {
            category_id?: number,
            name?: string;
            description?: string;
            active?: boolean;
            img_name?: File;
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