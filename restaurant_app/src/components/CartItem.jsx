export default function CartItem({ item }) {
  return (
    <div className="cart-item">
      <span>{item.name}</span>
      <span>₹{item.price}</span>
    </div>
  );
}
