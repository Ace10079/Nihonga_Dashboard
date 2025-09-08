import React, { useEffect, useState } from "react";
import {
  getHeros,
  createHero,
  deleteHero,
  getCollections,
  getProducts,
} from "../services/api";

const BASE_URL = "https://nihonga-backend.onrender.com";

// Landing API endpoints
async function getLanding() {
  const res = await fetch(`${BASE_URL}/api/landing`);
  if (!res.ok) throw new Error("Failed to fetch landing data");
  return res.json();
}

async function updateLandingCollections(collections) {
  const res = await fetch(`${BASE_URL}/api/landing/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collections }),
  });
  if (!res.ok) throw new Error("Failed to update collections");
  return res.json();
}

async function updateLandingBestSellers(bestSellers) {
  const res = await fetch(`${BASE_URL}/api/landing/bestsellers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bestSellers }),
  });
  if (!res.ok) throw new Error("Failed to update best sellers");
  return res.json();
}

export default function Landing() {
  const [heroImages, setHeroImages] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [bestSellerModalOpen, setBestSellerModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeHero, setActiveHero] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all landing data
  useEffect(() => {
    async function fetchData() {
      try {
        const [herosData, collectionsData, productsData, landingData] =
          await Promise.all([getHeros(), getCollections(), getProducts(), getLanding()]);

        setHeroImages(herosData);
        setCollections(collectionsData);
        setProducts(productsData);

        // Load saved selected collections & best sellers
        setSelectedCollections(landingData.collections || []);
        setBestSellers(landingData.bestSellers || []);
      } catch (err) {
        console.error("Failed to fetch landing data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* -----------------------------
     HERO IMAGE HANDLERS
  ----------------------------- */
  const handleHeroUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const newHero = await createHero(formData);
      setHeroImages((prev) => [...prev, newHero]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Hero upload failed:", err);
    }
  };

  const handleHeroDelete = async (id) => {
    try {
      setIsDeleting(true);
      await deleteHero(id);
      setHeroImages((prev) => prev.filter((h) => h._id !== id));
      if (activeHero >= heroImages.length - 1) {
        setActiveHero(0);
      }
    } catch (err) {
      console.error("Failed to delete hero:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const prevHero = () => setActiveHero((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  const nextHero = () => setActiveHero((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));

  /* -----------------------------
     COLLECTION HANDLERS
  ----------------------------- */
  const addCollection = async (collection) => {
    if (!selectedCollections.find((c) => c._id === collection._id)) {
      const newSelected = [...selectedCollections, collection];
      setSelectedCollections(newSelected);
      await updateLandingCollections(newSelected.map(c => c._id));
    }
    setCollectionModalOpen(false);
  };

  const removeCollection = async (id) => {
    const newSelected = selectedCollections.filter((c) => c._id !== id);
    setSelectedCollections(newSelected);
    await updateLandingCollections(newSelected.map(c => c._id));
  };

  /* -----------------------------
     BEST SELLER HANDLERS
  ----------------------------- */
  const addBestSeller = async (product) => {
    if (!bestSellers.find((p) => p._id === product._id)) {
      const newSelected = [...bestSellers, product];
      setBestSellers(newSelected);
      await updateLandingBestSellers(newSelected.map(p => p._id));
    }
    setBestSellerModalOpen(false);
  };

  const removeBestSeller = async (id) => {
    const newSelected = bestSellers.filter((p) => p._id !== id);
    setBestSellers(newSelected);
    await updateLandingBestSellers(newSelected.map(p => p._id));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-full bg-indigo-500 h-12 w-12 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Landing Page Management
        </h1>

        {/* Upload success notification */}
        {uploadSuccess && (
          <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Image uploaded successfully!
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="mb-12 bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Hero Images
            </h2>
            <label className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-indigo-600 hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Image
              <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
            </label>
          </div>
          
          {heroImages.length > 0 ? (
            <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeHero * 100}%)` }}
              >
                {heroImages.map((hero, index) => (
                  <div key={hero._id} className="w-full flex-shrink-0 relative">
                    <img
                      src={`${BASE_URL}${hero.image}`}
                      alt="Hero"
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Slide {index + 1} of {heroImages.length}</span>
                        <button
                          onClick={() => handleHeroDelete(hero._id)}
                          disabled={isDeleting}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center transition-all duration-300 hover:bg-red-600 disabled:opacity-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {heroImages.length > 1 && (
                <>
                  <button
                    onClick={prevHero}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 hover:bg-indigo-500 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextHero}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 hover:bg-indigo-500 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveHero(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeHero === index ? 'bg-white' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500">No hero images yet. Upload your first image to get started.</p>
            </div>
          )}
        </section>

        {/* Collections Section */}
        <section className="mb-12 bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Featured Collections
            </h2>
            <button
              onClick={() => setCollectionModalOpen(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-indigo-600 hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Collection
            </button>
          </div>
          
          {selectedCollections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCollections.map((collection) => (
                <div key={collection._id} className="border border-gray-200 rounded-xl p-4 relative transition-all duration-300 hover:shadow-md group">
                  <button
                    onClick={() => removeCollection(collection._id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="font-medium text-gray-800 mb-2">{collection.name}</h3>
                  {collection.image && (
                    <img
                      src={`${BASE_URL}${collection.image}`}
                      alt={collection.name}
                      className="w-full h-52 object-cover mt-2 rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="mt-2">No collections selected yet.</p>
            </div>
          )}
        </section>

        {/* Best Sellers Section */}
        <section className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Best Sellers
            </h2>
            <button
              onClick={() => setBestSellerModalOpen(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-indigo-600 hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Best Seller
            </button>
          </div>
          
          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-xl p-4 relative transition-all duration-300 hover:shadow-md group">
                  <button
                    onClick={() => removeBestSeller(product._id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                  {product.heroImage && (
                    <img
                      src={`${BASE_URL}${product.heroImage}`}
                      alt={product.name}
                      className="w-full h-52 object-cover mt-2 rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="mt-2">No best sellers selected yet.</p>
            </div>
          )}
        </section>

        {/* Collection Selection Modal */}
        {collectionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Select a Collection
                </h3>
              </div>
              <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                {collections.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => addCollection(c)}
                    className="cursor-pointer border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:border-indigo-500 hover:shadow-md"
                  >
                    <h4 className="font-medium text-gray-800 mb-2">{c.name}</h4>
                    {c.image && (
                      <img
                        src={`${BASE_URL}${c.image}`}
                        alt={c.name}
                        className="w-full h-52 object-cover mt-2 rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => setCollectionModalOpen(false)}
                  className="w-full bg-gray-300 text-gray-800 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Best Seller Selection Modal */}
        {bestSellerModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Select Best Seller Products
                </h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => addBestSeller(p)}
                    className="cursor-pointer border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:border-indigo-500 hover:shadow-md"
                  >
                    <h4 className="font-medium text-gray-800 mb-2">{p.name}</h4>
                    {p.heroImage && (
                      <img
                        src={`${BASE_URL}${p.heroImage}`}
                        alt={p.name}
                        className="w-full h-52 object-cover mt-2 rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => setBestSellerModalOpen(false)}
                  className="w-full bg-gray-300 text-gray-800 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}