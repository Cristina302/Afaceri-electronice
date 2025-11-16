import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchProducts, deleteProduct } from "../api/product.routes";
import { addProductToCart } from "../api/cart.routes";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data, success, message } = await fetchProducts();
        if (success && Array.isArray(data)) {
          setProducts(data);
        } else {
          toast.error(message || "Failed to load products");
        }
      } catch (err) {
        toast.error(err.message || "Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleEditClick = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteClick = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(productId);
      const { success, message } = await deleteProduct(productId);
      if (success) {
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(message || "Failed to delete product");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateClick = () => {
    navigate("/products/create");
  };

  const handleAddToCart = async (productId) => {
    try {
      const { success, message } = await addProductToCart(productId, 1);
      if (success) {
        toast.success("Product added to cart");
      } else {
        toast.error(message || "Failed to add product to cart");
      }
    } catch (err) {
      toast.error(err.message || "Error adding product to cart");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!products || products.length === 0)
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No products available</p>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create First Product
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create Product
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-md shadow p-4">
              <div className="relative">
                <img
                  alt={product.name}
                  src={product.image || "https://via.placeholder.com/300"}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 pointer-events-none"
                />

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md shadow-lg transition-colors duration-200"
                      onClick={() => handleEditClick(product.id)}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteClick(product.id)}
                      disabled={deletingId === product.id}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>

              {/* Add to Cart Button */}
              {!isAdmin && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
