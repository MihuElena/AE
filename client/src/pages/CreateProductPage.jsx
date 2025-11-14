import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreateEditProductForm from '../components/CreateEditProductForm';
import { createProduct } from '../api/product.routes';

export default function CreateProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await createProduct(formData);

      if (response?.success) {
        toast.success('Product created successfully!');
        navigate('/products');
      } else {
        toast.error(response?.message || 'Failed to create product');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while creating the product');
      throw error;
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1543422655-cb586ad21df1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Overlay blur + dark */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-none"></div>

      {/* Scrollable container */}
      <div className="relative z-10 max-w-3xl mx-auto py-16 px-4 overflow-y-auto min-h-screen">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl p-6">
          <CreateEditProductForm onSubmit={handleSubmit} />
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
