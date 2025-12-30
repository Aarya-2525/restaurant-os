import { useEffect, useState } from "react";
import { fetchMenu } from "../api";
import MenuCategory from "../components/MenuCategory";

export default function MenuPage({ onGoToCart }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMenu(1).then(setMenu).catch(console.error);
  }, []);

  function addToCart(item) {
    setCart(prev => [...prev, item]);
  }

  return (
    <main>
      <h1>Veronica’s Bombay</h1>

      {menu.map(category => (
        <MenuCategory
          key={category.id}
          category={category}
          onAdd={addToCart}
        />
      ))}

      <button onClick={() => onGoToCart(cart)}>
        Go to Cart ({cart.length})
      </button>
    </main>
  );
}
