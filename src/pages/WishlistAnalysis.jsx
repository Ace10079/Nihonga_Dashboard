import React, { useEffect, useState } from "react";
import { getAllUsersWishlists } from "../services/api";

const WishlistAnalysis = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const data = await getAllUsersWishlists();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Wishlist Analysis</h1>
      {users.map(user => (
        <div key={user._id} className="mb-4 p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold mb-2">User: {user.name}</h2>
          <ul className="list-disc ml-5">
            {user.wishlist.length > 0 ? (
              user.wishlist.map(product => (
                <li key={product._id}>{product.name}</li>
              ))
            ) : (
              <li>No products in wishlist</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WishlistAnalysis;
