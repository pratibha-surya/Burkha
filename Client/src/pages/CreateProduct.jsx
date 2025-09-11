"use client";

import { useState, useEffect } from "react";
import { addProduct, fetchcategory, fetchSubcategory } from "../api";
import { Upload, X } from "lucide-react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    description: "",
    color: "",
    fabric: "",
    size: [],
    category: "",
    subCategory: "",
    images: [],
    stock: "",
    youtubeUrl: "",
        // ✅ Rack field
    column: "", 
    rack: "",    // ✅ Column field
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchcategory();
        if (response.data) setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetchSubcategory();
        if (response.data) setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({
      ...prev,
      description: data,
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const sizes = [...prev.size];
      if (sizes.includes(size)) {
        return { ...prev, size: sizes.filter((s) => s !== size) };
      } else {
        return { ...prev, size: [...sizes, size] };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 5) {
      setError("You can upload a maximum of 5 images");
      return;
    }

    setImageFiles((prev) => [...prev, ...files.slice(0, 5 - prev.length)]);
    setError("");

    const newPreviews = [];
    files.slice(0, 5 - imageFiles.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (
          newPreviews.length === files.length ||
          newPreviews.length === 5 - imageFiles.length
        ) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "size") {
          productData.append(key, JSON.stringify(formData[key]));
        } else if (key !== "images") {
          productData.append(key, formData[key]);
        }
      });

      imageFiles.forEach((file) => {
        productData.append("images", file);
      });

      const response = await addProduct(productData);
      if (response.status === 201) {
        setFormData({
          name: "",
          price: "",
          mrp: "",
          description: "",
          color: "",
          fabric: "",
          size: [],
          category: "",
          subCategory: "",
          images: [],
          stock: "",
          youtubeUrl: "",
                 // ✅ Reset rack
          column: "",
          rack: "",     // ✅ Reset column
        });
        setImageFiles([]);
        setImagePreviews([]);
        toast.success("Product Created Successfully...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.warn("Product creation failed, please try again...");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories = formData.category
    ? subCategories.filter((subCat) => subCat.category === formData.category)
    : [];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-primary-600 text-white">
        <h2 className="text-xl font-bold">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <ToastContainer />
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* SubCategory */}
          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Category
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.category}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="">Select Sub-Category</option>
              {filteredSubCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* MRP */}
          <div>
            <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 mb-1">
              MRP (₹)
            </label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock*
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
            {/* Column */}
          <div>
            <label htmlFor="column" className="block text-sm font-medium text-gray-700 mb-1">
              Column Number
            </label>
            <input
              type="text"
              id="column"
              name="column"
              value={formData.column}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Rack */}
          <div>
            <label htmlFor="rack" className="block text-sm font-medium text-gray-700 mb-1">
              Rack Number
            </label>
            <input
              type="text"
              id="rack"
              name="rack"
              value={formData.rack}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

        

          {/* Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Fabric */}
          <div>
            <label htmlFor="fabric" className="block text-sm font-medium text-gray-700 mb-1">
              Fabric
            </label>
            <input
              type="text"
              id="fabric"
              name="fabric"
              value={formData.fabric}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="flex gap-2">
            {["52", "54", "56", "58"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded-md border ${formData.size.includes(size)
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 border-gray-300"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* YouTube URL */}
        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
            YouTube URL
          </label>
          <input
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=xxxx"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="border border-gray-300 rounded-md">
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32 cursor-pointer">
            <Upload />
            <p className="text-sm text-gray-500">Upload up to 5 images</p>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={imageFiles.length >= 5}
            />
          </label>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-2 bg-primary-600 text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
