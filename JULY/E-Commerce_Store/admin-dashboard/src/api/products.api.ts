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

    async update (
        id: number | string,
        product: {
          category_id?: number,
          name?: string;
          description?: string;
          active?: boolean;
          img_name?: File; // Use img_name as your file field
          price?: number;
          stock?: number;
        }
      ) {
        try {
          let response;
          if (product.img_name instanceof File) {
            console.log("Yo")
            const formData = new FormData();
            if (product.category_id !== undefined) formData.append("category_id", String(product.category_id));
            if (product.name !== undefined) formData.append("name", product.name);
            if (product.description !== undefined) formData.append("description", product.description);
            if (product.active !== undefined) formData.append("active", String(product.active));
            if (product.price !== undefined) formData.append("price", String(product.price));
            if (product.stock !== undefined) formData.append("stock", String(product.stock));
            formData.append("image", product.img_name);
      
            response = await fetch(`${API_BASE_URL}/products/${id}`, {
              method: "PUT",
              body: formData,
            });
          } else {
            const backendProduct = { ...product };
            response = await fetch(`${API_BASE_URL}/products/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(backendProduct),
            });
          }
      
          if (!response.ok) {
            throw new Error;
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
          console.error("Error updating product:", error);
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