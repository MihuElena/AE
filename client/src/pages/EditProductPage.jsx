import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreateEditProductForm from '../components/CreateEditProductForm';
import { getProductById, updateProduct } from '../api/product.routes';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        if (response?.success || response?.data) {
          setProduct(response.data || response);
        } else {
          setError(response?.message || 'Failed to load product');
          toast.error('Failed to load product');
          setTimeout(() => navigate('/products'), 2000);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the product');
        toast.error('An error occurred while fetching the product');
        setTimeout(() => navigate('/products'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const response = await updateProduct(id, formData);
      if (response?.success) {
        toast.success('Product updated successfully!');
        navigate('/products');
      } else {
        toast.error(response?.message || 'Failed to update product');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while updating the product');
      throw error;
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !product) {
    return (
      <div className="relative w-full min-h-screen bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center bg-fixed"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543422655-cb586ad21df1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      
      {/* Overlay blur + dark */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-none"></div>

      {/* Scrollable container */}
      <div className="relative z-10 max-w-3xl mx-auto py-16 px-4 overflow-y-auto min-h-screen">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl p-6">
          <CreateEditProductForm product={product} onSubmit={handleSubmit} isLoading={loading} />
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
