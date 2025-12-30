import { useState } from "react";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

export default function App() {
  const [page, setPage] = useState("menu");
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

  if (page === "menu") {
    return (
      <MenuPage
        onGoToCart={(cartItems) => {
          setCart(cartItems);
          setPage("cart");
        }}
      />
    );
  }

  if (page === "cart") {
    return (
      <CartPage
        cart={cart}
        onOrderPlaced={(orderData) => {
          setOrder(orderData);
          setPage("success");
        }}
      />
    );
  }

  if (page === "success") {
    return <OrderSuccessPage order={order} />;
  }
}
