import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProductById, updateProduct } from "../api/product.api";
import { updateProductInList } from "../redux/productSlice";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const product = response.data.data.product;
        reset({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
        });
      } catch (error) {
        setServerError("Failed to load product");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      };
      const response = await updateProduct(id, payload);
      dispatch(updateProductInList(response.data.data.product));
      navigate("/products");
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      {serverError && (
        <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="block mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block mb-1">Stock</label>
          <input
            type="number"
            {...register("stock", { required: "Stock is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block mb-1">Category</label>
          <input {...register("category")} className="w-full border p-2 rounded" />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
