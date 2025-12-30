const BASE_URL = "http://127.0.0.1:8000";

export async function fetchMenu(restaurantId) {
  const res = await fetch(`${BASE_URL}/api/restaurants/${restaurantId}/menu/`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

export async function placeOrder(restaurantId, orderData) {
  const res = await fetch(`${BASE_URL}/api/restaurants/${restaurantId}/orders/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

export async function adminLogin(username, password) {
  const res = await fetch(`${BASE_URL}/admin/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function fetchAdminOrders(token) {
  const res = await fetch(`${BASE_URL}/admin/orders/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(orderId, status, token) {
  const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order");
}
