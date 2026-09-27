import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/product.api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data.data.product);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <Link to="/products" className="text-blue-600 hover:underline">
        ← Back to Products
      </Link>
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-blue-600 font-semibold mt-2">₹{product.price}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
    </div>
  );
};

export default ProductDetailPage;
