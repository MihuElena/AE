import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProducts, deleteProduct } from '../api/product.routes';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  

  const user = useSelector((state) => state.user.user);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const isAdmin = user?.role === 'admin';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleEditClick = (productId) => navigate(`/products/edit/${productId}`);
  const handleDeleteClick = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setDeletingId(productId);
      const response = await deleteProduct(productId);
      if (response?.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error(response?.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while deleting the product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateClick = () => navigate('/products/create');

  const handleAddToCart = async (productId) => {
    if (!loggedIn) {
      toast.info('Please login to use the cart');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success('Product added to cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err || 'Failed to add product to cart');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  if (!products || products.length === 0) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No products available</p>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Product
            </button>
          )}
        </div>
      </div>
    );
  }

  // Extragem categoriile unice
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Lista filtrată
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
  <div
    className="relative w-full min-h-screen bg-cover bg-center bg-fixed overflow-y-auto"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1543422655-cb586ad21df1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    }}
  >
    <div className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-none"></div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-wide text-white">
          Our Premium Collection
        </h2>

        <div className="flex items-center gap-4">
          {/* Filtru categorii */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md px-3 py-2 text-black font-medium focus:outline-none"
          >
            <option value="All">Select Category</option>
            {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center rounded-full bg-indigo-700 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-600 transition duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Product
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products
          .filter(
            (p) => selectedCategory === 'All' || p.category === selectedCategory
          )
          .map((product) => (
            <div
              key={product.id}
              className="group relative bg-white/10 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Tooltip */}
                {product.description && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    {product.description}
                  </div>
                )}

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-lg transition-colors duration-200"
                      onClick={() => handleEditClick(product.id)}
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteClick(product.id)}
                      disabled={deletingId === product.id}
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="text-gray-200 text-sm">{product.category}</p>
                  <p className="text-white font-medium mt-2">${product.price}</p>
                </div>

                {!isAdmin && (
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="mt-4 w-full rounded-full bg-indigo-700 text-white font-semibold py-2 shadow-lg hover:bg-indigo-600 hover:scale-105 transform transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>

    {/* Scrollbar styling */}
    <style>
      {`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.4);
          border-radius: 10px;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.4) rgba(255,255,255,0.1);
        }
      `}
    </style>
  </div>
);


}
