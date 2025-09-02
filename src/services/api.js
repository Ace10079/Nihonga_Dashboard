export const BASE_URL = "http://localhost:5000/api";

/* ------------------------------
   COLLECTION API
------------------------------ */
export async function getCollections() {
  const res = await fetch(`${BASE_URL}/collections/getall`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return await res.json();
}

export async function createCollection(formData) {
  // formData is already FormData from your AddModal
  const res = await fetch(`${BASE_URL}/collections/post`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create collection");
  return await res.json();
}

export async function updateCollection(id, formData) {
  // formData is already FormData from your EditModal
  const res = await fetch(`${BASE_URL}/collections/update/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update collection");
  return await res.json();
}

export async function deleteCollection(id) {
  const res = await fetch(`${BASE_URL}/collections/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete collection");
  return await res.json();
}

/* ------------------------------
   PRODUCT API
------------------------------ */
export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products/getall`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

export async function getProductsByCollection(collectionId) {
  const res = await fetch(`${BASE_URL}/products?collection=${collectionId}`);
  if (!res.ok) throw new Error("Failed to fetch products for collection");
  return await res.json();
}

export async function createProduct(formData) {
  const res = await fetch(`${BASE_URL}/products/post`, {
    method: "POST",
    body: formData, // Send the FormData directly
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create product");
  }

  return await res.json();
}

export async function updateProduct(id, formData) {
  const res = await fetch(`${BASE_URL}/products/update/${id}`, {
    method: "PUT",
    body: formData, // Send the FormData directly
  });

  if (!res.ok) throw new Error("Failed to update product");
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/products/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return await res.json();
}
export async function getCollectionProducts(collectionId) {
    const response = await fetch(`${API_BASE_URL}/collections/${collectionId}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch collection products");
    }
    return response.json();
  }




  export const stockAPI = {
    getStock: async (search = "") => {
      const res = await fetch(`${BASE_URL}/stock/getall?search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error("Failed to fetch stock");
      return res.json();
    },
  
    updateStock: async (productId, stock) => {
      const res = await fetch(`${BASE_URL}/stock/update/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) throw new Error("Failed to update stock");
      return res.json();
    },
  
    bulkUpdateStock: async (updates) => {
      const res = await fetch(`${BASE_URL}/stock/bulk/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to bulk update stock");
      return res.json();
    },
  
    getSummary: async () => {
      const res = await fetch(`${BASE_URL}/stock/summary`);
      if (!res.ok) throw new Error("Failed to fetch stock summary");
      return res.json();
    }
  };

  /* ------------------------------
   HERO API
------------------------------ */
export async function getHeros() {
  const res = await fetch(`${BASE_URL}/heros/getall`);
  if (!res.ok) throw new Error("Failed to fetch hero images");
  return await res.json();
}

export async function createHero(formData) {
  const res = await fetch(`${BASE_URL}/heros/post`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload hero image");
  return await res.json();
}

export async function deleteHero(id) {
  const res = await fetch(`${BASE_URL}/heros/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete hero image");
  return await res.json();
}

  // Admin APIs
export async function getAdmins() {
  const res = await fetch(`${BASE_URL}/admin/getall`);
  if (!res.ok) throw new Error("Failed to fetch admins");
  return res.json();
}

export async function createAdmin(adminData) {
  const res = await fetch(`${BASE_URL}/admin/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adminData),
  });
  if (!res.ok) throw new Error("Failed to create admin");
  return res.json();
}

export async function deleteAdmin(id) {
  const res = await fetch(`${BASE_URL}/admin/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete admin");
  return res.json();
}

// User APIs
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/user/getall`); // FIXED
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/user/update/${id}`, { // FIXED
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}