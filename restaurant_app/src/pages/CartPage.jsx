import { placeOrder } from "../api";

export default function CartPage({ cart, onOrderPlaced }) {
  const orderPayload = {
    table_number: 1,
    items: cart.map(item => ({
      menu_item: item.id,
      quantity: 1,
    })),
  };

  async function handlePlaceOrder() {
    const response = await placeOrder(1, orderPayload);
    onOrderPlaced(response);
  }

  const eta = Math.max(
    ...cart.map(i => i.cooking_time_minutes),
    0
  );

  return (
    <main>
      <h1>Your Cart</h1>

      {cart.map((item, i) => (
        <div key={i}>
          {item.name} – ₹{item.price}
        </div>
      ))}

      <p>Estimated wait time: {eta} minutes</p>

      <button onClick={handlePlaceOrder}>
        Place Order
      </button>
    </main>
  );
}
