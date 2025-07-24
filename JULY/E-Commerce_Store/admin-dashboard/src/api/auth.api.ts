
const API_BASE_URL = "http://localhost:5000"; 

export const loginAdmin = async (email: string, password: string) => {
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admins/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Try to show backend error that we saved in service
      return { error: data?.error || data?.message || "Invalid credentials" };
    }
    return data;
  } catch (err: any) {
    return { error: err.message || "Network error" };
  }
};

export const createAdmin = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  role: string = "Admin"
) => {
  if (!first_name || !last_name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password, role }),
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