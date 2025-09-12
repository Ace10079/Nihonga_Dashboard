import React, { useEffect, useState } from "react";
import { getAllCarts } from "../services/api";

const CartAnalysis = () => {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const data = await getAllCarts();
      setCarts(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cart Analysis</h1>
      {carts.map(cart => (
        <div key={cart._id} className="mb-4 p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold mb-2">User: {cart.userId}</h2>
          <ul className="list-disc ml-5">
            {cart.items.map((item, idx) => (
              <li key={idx}>
                {item.productId.name} - Qty: {item.quantity} - Size: {item.size || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CartAnalysis;
