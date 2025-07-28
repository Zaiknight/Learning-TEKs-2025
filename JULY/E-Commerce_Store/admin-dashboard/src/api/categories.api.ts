const API_BASE_URL = "http://localhost:5000"; 

export const CategoryAPI = {

    async fetchCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const result = await response.json();
            if (Array.isArray(result)) return result;
            if (result && Array.isArray(result.data)) {
                return result.data.map((cat: any) => ({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    active: cat.active,
                    image: cat.img_name, 
                }));
            }
            return [];
        } catch (error: any) {
            console.error("Error fetching categories:", error);
            return [];
        }
    },

    // Get category by ID
    async fetchCategoryById(id: number | string) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch category by id");
            }
            const result = await response.json();
            if (result && result.data) {
                const cat = result.data;
                return {
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    active: cat.active,
                    image: cat.img_name,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error fetching category by id:", error);
            throw error;
        }
    },

    // Get category by Name
    async fetchCategoryByName(name: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/name/${encodeURIComponent(name)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch category by name");
            }
            const result = await response.json();
            if (result && result.data) {
                const cat = result.data;
                return {
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    active: cat.active,
                    image: cat.img_name,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error fetching category by name:", error);
            throw error;
        }
    },

    // Create new category
    async createCategory(category: {
        name: string;
        description: string;
        active: boolean;
        img_name: File;
    }) {
        try {
            const formData = new FormData();
            formData.append("name", category.name);
            formData.append("description", category.description);
            formData.append("active", String(category.active));
            formData.append("image", category.img_name);

            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to create category");
            }
            const result = await response.json();
            if (result && result.data) {
                const cat = result.data;
                return {
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    active: cat.active,
                    image: cat.img_name,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error creating category:", error);
            throw error;
        }
    },

    // Update category by ID
    async updateCategory(
        id: number | string,
        category: {
            name?: string;
            description?: string;
            active?: boolean;
            image?: string;
        }
    ) {
        try {
            // Map frontend 'image' to backend 'img_name'
            const backendCategory: any = {
                ...category,
            };
            if (backendCategory.image !== undefined) {
                backendCategory.img_name = backendCategory.image;
                delete backendCategory.image;
            }
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(backendCategory),
            });
            if (!response.ok) {
                throw new Error("Failed to update category");
            }
            const result = await response.json();
            if (result && result.data) {
                const cat = result.data;
                return {
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    active: cat.active,
                    image: cat.img_name,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error updating category:", error);
            throw error;
        }
    },

    // Delete category by ID
    async deleteCategory(id: number | string) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete category");
            }
            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
}