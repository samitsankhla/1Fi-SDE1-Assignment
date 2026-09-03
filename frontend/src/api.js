const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getProduct(slug) {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function previewOrder(selection) {
  const res = await fetch(`${API_URL}/orders/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selection),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Unable to proceed");
  return data;
}
