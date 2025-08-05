const API_BASE_URL = "http://localhost:5000"; 

export const OrderItemsAPI = {
    async fetchByOrderId(id: number | string) {
        try {
            const response = await fetch(`${API_BASE_URL}/orderItem/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch order by id");
            }
            const result = await response.json();
            if (result && result.data) {
                const order = result.data;
                return {
                    id: order.id,
                    product_id: order.product_id,
                    order_id: order.order_id,
                    quantity: order.quantity,
                };
            }
            return null;
        } catch (error: any) {
            console.error("Error fetching order items by id:", error);
            throw error;
        }
    },
}