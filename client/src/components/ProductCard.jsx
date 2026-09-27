import { Link } from "react-router-dom";

const ProductCard = ({ product, user, onDelete }) => {
  return (
    <div className="border rounded p-4">
      <Link to={`/products/${product._id}`}>
        <h2 className="font-bold text-lg hover:underline">{product.name}</h2>
      </Link>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-blue-600 font-semibold mt-2">₹{product.price}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>

      {user && (
        <div className="flex gap-2 mt-3">
          <Link
            to={`/products/edit/${product._id}`}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
