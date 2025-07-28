const API_URL = process.env.API_BASE_URL;

export const create = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,

  ) => {
    if (!first_name || !last_name || !email || !password) {
      return { error: "All fields are required" };
    }
  
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password}),
      });
  
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
  
        return {
          error: data?.error || data?.message,
          validation_errors: data?.validation_errors || undefined
        };
      }
      return data;
    } catch (err: any) {
      return { error: err.message || "Network error" };
    }
  };