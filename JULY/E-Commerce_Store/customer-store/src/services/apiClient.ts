export async function jsonFetch<T = any>(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<T> {
    const res = await fetch(input, init);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        (data && (data.error || data.message)) ||
        `Request failed with status ${res.status}`;
      throw new Error(message);
    }
    return data as T;
  }