export default function OrderSuccessPage({ order }) {
  return (
    <main>
      <h1>Order Confirmed</h1>
      <p>Order ID: {order.id}</p>
      <p>ETA: {order.estimated_wait_time} minutes</p>
    </main>
  );
}
