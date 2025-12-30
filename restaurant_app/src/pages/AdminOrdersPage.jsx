import { useEffect, useState } from "react";
import { fetchAdminOrders, updateOrderStatus } from "../api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAdminOrders(token).then(setOrders);
  }, [token]);

  async function handleUpdate(id, status) {
    await updateOrderStatus(id, status, token);
    const updated = await fetchAdminOrders(token);
    setOrders(updated);
  }

  return (
    <main>
      <h1>Kitchen Orders</h1>

      {orders.map(order => (
        <div key={order.id}>
          <h3>Table {order.table_number}</h3>
          <p>Status: {order.status}</p>

          <ul>
            {order.items.map(item => (
              <li key={item.id}>
                {item.menu_item.name} × {item.quantity}
              </li>
            ))}
          </ul>

          <button onClick={() => handleUpdate(order.id, "preparing")}>
            Preparing
          </button>

          <button onClick={() => handleUpdate(order.id, "completed")}>
            Completed
          </button>
        </div>
      ))}
    </main>
  );
}
