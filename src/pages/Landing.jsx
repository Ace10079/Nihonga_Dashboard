import React, { useState } from "react";
import AddModal from "../components/modals/AddModal";
import EditModal from "../components/modals/EditModal";
import DeleteModal from "../components/modals/DeleteModal";

// Sample data with real images
const initialHero = [
  { id: 1, url: "https://images.unsplash.com/photo-1606813909227-6201a4d90f5a?w=1200" },
  { id: 2, url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200" },
  { id: 3, url: "https://images.unsplash.com/photo-1606813909227-6201a4d90f5a?w=1200" },
];

const initialCollections = [
  { id: 1, title: "Summer Collection", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600" },
  { id: 2, title: "Winter Collection", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" },
  {
    id: 3,
    title: "Festive Deals",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
  }
];

const initialBestSellers = [
  { id: 1, name: "Denim Jacket", image: "https://images.unsplash.com/photo-1602810317797-56b1f648f3a1?w=400" },
  { id: 2, name: "Sneakers", image: "https://images.unsplash.com/photo-1606813908993-9c60db8c2d6d?w=400" },
  { id: 3, name: "Sunglasses", image: "https://images.unsplash.com/photo-1549921296-3a6b94f98f5c?w=400" },
];

export default function Landing() {
  const [heroImages, setHeroImages] = useState(initialHero);
  const [collections, setCollections] = useState(initialCollections);
  const [bestSellers, setBestSellers] = useState(initialBestSellers);
  const [activeSlide, setActiveSlide] = useState(0);

  const [currentEdit, setCurrentEdit] = useState(null);

  // Hero modals
  const [addHeroOpen, setAddHeroOpen] = useState(false);
  const [editHeroOpen, setEditHeroOpen] = useState(false);
  const [deleteHeroOpen, setDeleteHeroOpen] = useState(false);

  // Collection modals
  const [addCollectionOpen, setAddCollectionOpen] = useState(false);
  const [editCollectionOpen, setEditCollectionOpen] = useState(false);
  const [deleteCollectionOpen, setDeleteCollectionOpen] = useState(false);

  // Best Seller modals
  const [addBestSellerOpen, setAddBestSellerOpen] = useState(false);
  const [editBestSellerOpen, setEditBestSellerOpen] = useState(false);
  const [deleteBestSellerOpen, setDeleteBestSellerOpen] = useState(false);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white">
        <div className="flex justify-between items-center px-4 py-3">
          <h2 className="text-xl font-bold text-gray-800">Hero Section</h2>
          <button onClick={() => setAddHeroOpen(true)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Add Slide
          </button>
        </div>
        <div className="relative">
          <img src={heroImages[activeSlide]?.url} className="w-full h-72 object-cover" />
          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            <button onClick={prevSlide} className="bg-white p-2 rounded-full shadow hover:bg-gray-200">&larr;</button>
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <button onClick={nextSlide} className="bg-white p-2 rounded-full shadow hover:bg-gray-200">&rarr;</button>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={() => { setCurrentEdit(heroImages[activeSlide]); setEditHeroOpen(true); }} className="bg-yellow-400 text-white px-3 py-1 text-sm rounded hover:bg-yellow-500">Edit</button>
            <button onClick={() => setDeleteHeroOpen(true)} className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">Delete</button>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section>
        <div className="flex justify-between items-center px-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Collections</h2>
          <button onClick={() => setAddCollectionOpen(true)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Add Collection</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
          {collections.map((item) => (
            <div key={item.id} className="rounded-lg shadow-md overflow-hidden bg-white relative">
              <img src={item.image} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-700">{item.title}</h3>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => { setCurrentEdit(item); setEditCollectionOpen(true); }} className="bg-yellow-400 text-white px-2 py-1 text-xs rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => { setCurrentEdit(item); setDeleteCollectionOpen(true); }} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Best Sellers</h2>
          <button onClick={() => setAddBestSellerOpen(true)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Add Best Seller</button>
        </div>
        <div className="flex flex-wrap gap-6">
          {bestSellers.map((product) => (
            <div key={product.id} className="w-48 rounded-lg overflow-hidden shadow bg-white relative">
              <img src={product.image} className="w-full h-40 object-cover" />
              <div className="p-3 text-center">
                <h4 className="text-sm font-medium text-gray-700">{product.name}</h4>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => { setCurrentEdit(product); setEditBestSellerOpen(true); }} className="bg-yellow-400 text-white px-2 py-1 text-xs rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => { setCurrentEdit(product); setDeleteBestSellerOpen(true); }} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals (Hero + Collection + Best Seller) */}
      {/* Reuse same modal structure for each section */}

      {/* Hero */}
      <AddModal open={addHeroOpen} onClose={() => setAddHeroOpen(false)} title="Add Hero Slide" fields={[{ label: "Image URL", name: "url" }]} onSubmit={(e) => {
        const data = Object.fromEntries(new FormData(e.target));
        setHeroImages([...heroImages, { id: Date.now(), url: data.url }]);
        setAddHeroOpen(false);
      }} />
      <EditModal open={editHeroOpen} onClose={() => setEditHeroOpen(false)} initialData={currentEdit} title="Edit Hero Slide" fields={[{ label: "Image URL", name: "url" }]} onSubmit={(e) => {
        const data = Object.fromEntries(new FormData(e.target));
        setHeroImages(heroImages.map(h => h.id === currentEdit.id ? { ...h, url: data.url } : h));
        setEditHeroOpen(false);
      }} />
      <DeleteModal open={deleteHeroOpen} onClose={() => setDeleteHeroOpen(false)} itemName="hero slide" onConfirm={() => {
        setHeroImages(heroImages.filter((_, i) => i !== activeSlide));
        setActiveSlide(0);
        setDeleteHeroOpen(false);
      }} />

      {/* Collections */}
      <AddModal open={addCollectionOpen} onClose={() => setAddCollectionOpen(false)} title="Add Collection" fields={[{ label: "Title", name: "title" }, { label: "Image URL", name: "image" }]} onSubmit={(e) => {
        const data = Object.fromEntries(new FormData(e.target));
        setCollections([...collections, { id: Date.now(), ...data }]);
        setAddCollectionOpen(false);
      }} />
      <EditModal open={editCollectionOpen} onClose={() => setEditCollectionOpen(false)} initialData={currentEdit} title="Edit Collection" fields={[{ label: "Title", name: "title" }, { label: "Image URL", name: "image" }]} onSubmit={(e) => {
        const data = Object.fromEntries(new FormData(e.target));
        setCollections(collections.map(c => c.id === currentEdit.id ? { ...c, ...data } : c));
        setEditCollectionOpen(false);
      }} />
      <DeleteModal open={deleteCollectionOpen} onClose={() => setDeleteCollectionOpen(false)} itemName="collection" onConfirm={() => {
        setCollections(collections.filter(c => c.id !== currentEdit.id));
        setDeleteCollectionOpen(false);
      }} />

      {/* Best Sellers */}
      <AddModal open={addBestSellerOpen} onClose={() => setAddBestSellerOpen(false)} title="Add Best Seller" fields={[{ label: "Name", name: "name" }, { label: "Image URL", name: "image" }]} onSubmit={(e) => {
        const data = Object.fromEntries(new FormData(e.target));
        setBestSellers([...bestSellers, { id: Date.now(), ...data }]);
        setAddBestSellerOpen(false);
      }} />
      <EditModal open={editBestSellerOpen} onClose={() => setEditBestSellerOpen(false)} initialData={currentEdit} title="Edit Best Seller" fields={[{ label: "Name", name: "name" }, { label: "Image URL", name: "image" }]} onSubmit={(e) => {
        const data = Object.fromEntries(new FormData(e.target));
        setBestSellers(bestSellers.map(p => p.id === currentEdit.id ? { ...p, ...data } : p));
        setEditBestSellerOpen(false);
      }} />
      <DeleteModal open={deleteBestSellerOpen} onClose={() => setDeleteBestSellerOpen(false)} itemName="best seller" onConfirm={() => {
        setBestSellers(bestSellers.filter(p => p.id !== currentEdit.id));
        setDeleteBestSellerOpen(false);
      }} />
    </div>
  );
}
