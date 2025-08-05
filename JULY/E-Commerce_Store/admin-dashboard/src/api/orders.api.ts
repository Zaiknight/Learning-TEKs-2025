const API_BASE_URL = "http://localhost:5000";

export const OrderApi = {

  async fetchOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/order`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
    }
    const result = await res.json();
    if (Array.isArray(result)) return result;
    if (result && Array.isArray(result.data)) {
        return result.data.map((order: any) => ({
            id: order.id,
            user_id: order.user_id,
            user_email: order.user_email,
            status: order.status,
            payment_method: order.payment_method,
            payment_status: order.payment_status,
            created: order.created_at
        }));
    }
    return [];
    }catch (error: any) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async update(id: number, Order: {
        status ?: string;
        payment_method?: string;
        payment_status ?: string;
    }){
        try {
          const res = await fetch(`${API_BASE_URL}/order/${id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Order),
          });
          if (!res.ok) {
            throw new Error("Failed to update category");
        }
        const result = await res.json();
            if (result && result.data) {
                const order = result.data;
                return {
                    id: order.id,
                    user_id: order.user_id,
                    user_email: order.user_email,
                    status: order.status,
                    payment_method: order.payment_method,
                    payment_status: order.payment_status,
                    created: order.created_at
                };
            }
            return null;
        } catch (error:any) {
            console.error("Error updating order:", error);
            throw error;
        }
    }
}