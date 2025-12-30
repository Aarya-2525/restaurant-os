export default function OrderCard({ order }) {
  return (
    <div className="order-card">
      <h3>Table {order.table_number}</h3>
      <p>Status: {order.status}</p>

      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            {item.menu_item.name} × {item.quantity}
          </li>
        ))}
      </ul>

      <button>Preparing</button>
      <button>Completed</button>
    </div>
  );
}
