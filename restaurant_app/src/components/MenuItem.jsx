export default function MenuItem({ item, onAdd }) {
  return (
    <div className="menu-item">
      <h3>{item.name}</h3>
      <p>{item.description}</p>

      <div>
        <span>₹{item.price}</span>
        <button onClick={() => onAdd(item)}>
          Add
        </button>
      </div>
    </div>
  );
}
