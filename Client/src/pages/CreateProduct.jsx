"use client"

import { useState, useEffect } from "react"
import { addProduct, fetchcategory, fetchSubcategory } from "../api"
import { Upload, X } from "lucide-react"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

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
  })

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await fetchcategory()
        if (response.data) setCategories(response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetchSubcategory()
        if (response.data) setSubCategories(response.data)
      } catch (error) {
        console.error("Error fetching subcategories:", error)
      }
    }
    fetchSubCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData()
    setFormData((prev) => ({
      ...prev,
      description: data,
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const sizes = [...prev.size]
      if (sizes.includes(size)) {
        return { ...prev, size: sizes.filter((s) => s !== size) }
      } else {
        return { ...prev, size: [...sizes, size] }
      }
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length + imageFiles.length > 5) {
      setError("You can upload a maximum of 5 images")
      return
    }

    setImageFiles((prev) => [...prev, ...files.slice(0, 5 - prev.length)])
    setError("")

    const newPreviews = []
    files.slice(0, 5 - imageFiles.length).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target.result)
        if (newPreviews.length === files.length || newPreviews.length === (5 - imageFiles.length)) {
          setImagePreviews((prev) => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = new FormData()

      Object.keys(formData).forEach((key) => {
        if (key === "size") {
          productData.append(key, JSON.stringify(formData[key]))
        } else if (key !== "images") {
          productData.append(key, formData[key])
        }
      })

      imageFiles.forEach((file) => {
        productData.append("images", file)
      })

      const response = await addProduct(productData)
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
        })
        setImageFiles([])
        setImagePreviews([])
        toast.success("Product Created Successfully...")
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        toast.warn("Product creation failed, please try again...")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      setError("Failed to add product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredSubCategories = formData.category
    ? subCategories.filter(subCat => subCat.category === formData.category)
    : []

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-primary-600 text-white">
        <h2 className="text-xl font-bold">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <ToastContainer />

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

          {/* Sub-Category */}
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
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
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
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Available Quantity*
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="flex flex-wrap gap-3">
            {["52", "54", "56", "58"].map((size) => (
              <button
                type="button"
                key={size}
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
            YouTube Video URL
          </label>
          <input
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            placeholder="https://www.youtube.com/watch?v=example"
            value={formData.youtubeUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="border border-gray-300 rounded-md">
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-6 h-6 text-gray-500" />
              <span className="text-gray-600">Drop files or <span className="underline">browse</span></span>
              <span className="text-xs text-gray-500">
                {imageFiles.length >= 5
                  ? "Maximum 5 images reached"
                  : `Upload up to 5 images (${imageFiles.length}/5)`}
              </span>
            </div>
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
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 text-white font-semibold rounded-md"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProduct
