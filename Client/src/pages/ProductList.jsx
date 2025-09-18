"use client";

import { useEffect, useState } from "react";
import { deleteProduct, fetchProducts } from "../api";
import {
  Package,
  Search,
  RefreshCw,
  Trash2,
  ShoppingCart,
  Info,
  Edit,
  Printer,
  X,
  Home,
  Upload,
  Tag,
} from "lucide-react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MdSummarize } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProductList = () => {
  /* ------------- STATE ------------- */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchCart } = useCart();
  const [addingToCart, setAddingToCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
const [previewImage, setPreviewImage] = useState(null);       // to show image preview


  const [isSaving, setIsSaving] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    description: "",
    color: "",
    fabric: "",
    size: [],
    category: "",
    subCategory: "",
    stock: "",
    homeVisibility: false,
    images: [],
    existingImages: [],
    rack:"",
    column:""

  });
  const [printQuantity, setPrintQuantity] = useState(1);
  const [stickersPerPage, setStickersPerPage] = useState(4);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [productToPrint, setProductToPrint] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const navigate = useNavigate();

  /* ------------- HELPERS ------------- */
  const Quantity = () => navigate("/purchaseproduct");
  const goToProductDetails = () => {
    if (editingProduct?._id) {
      navigate(`product-details/:id`)
    }
  }
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteP = async (id) => {
    const res = await deleteProduct(id);
    if (res.data) setProducts(res.data.data);
    toast.success("Product Deleted Successfully.....");
  };

  /*   updateProduct  ------------------------------------ */
  const updateProduct = async (id, payload, images, keptOldImages) => {
    try {
      const formData = new FormData();

      // send scalar fields
      Object.entries(payload).forEach(([k, v]) => {
        if (k === "size") {
          formData.append(k, JSON.stringify(v));
        } else if (k !== "images") {
          formData.append(k, v);
        }
      });

      // remaining old images (urls) are sent as a JSON string
      if (keptOldImages.length) {
        formData.append("existingImages", JSON.stringify(keptOldImages));
      }

      // new files
      images.forEach((f) => formData.append("images", f));

      setIsSaving(true);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/product/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data ?? null;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  /*   handleEditSubmit  -------------------------------- */
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const payload = {
        name: editFormData.name,
        price: Number(editFormData.price),
        mrp: Number(editFormData.mrp),
        description: editFormData.description,
        color: editFormData.color,
        fabric: editFormData.fabric,
        rack: editFormData.rack,
  column: editFormData.column,
        size: editFormData.size,
        stock: Number(editFormData.stock),
        homeVisibility: editFormData.homeVisibility,
        category: editFormData.category._id, // ✅ ID bhejo
        subCategory: editFormData.subCategory._id, // ✅ ID bhejo
      };

      const oldKept = editFormData.existingImages;

      const updated = await updateProduct(
        editingProduct._id,
        payload,
        newImages,
        oldKept
      );

      if (updated) {
        if (updated) {
          setEditingProduct(null);
          setNewImages([]);
          setEditFormData({
            name: "",
            price: "",
            mrp: "",
            description: "",
            color: "",
            fabric: "",
           
            column:"",
             rack:"",
            size: [],
            category: "",
            subCategory: "",
            stock: "",
            homeVisibility: false,
            existingImages: [],
          });

          setProducts((prev) =>
            prev.map((p) => (p._id === updated._id ? updated : p))
          );
          setEditingProduct(null); // ✅ Ab tumhara edit form fresh populated hoga!
          toast.success("Product edited successfully!");
          navigate("/");
        } else {
          toast.warn("Error updating product");
        }
      } else {
        toast.warn("Error updating product");
      }
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setIsSaving(false); // Set loading state to false when done
    }
  };

  const handlePrintProduct = (product) => {
    setProductToPrint(product);
    setShowPrintDialog(true);
  };

  const toggleHomeVisibility = async (productId) => {
    try {
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id === productId) {
            const newV = !p.homeVisibility;
            axios
              .put(
                `${
                  import.meta.env.VITE_API_URL
                }/product/${productId}/home-visibility`,
                { homeVisibility: newV }
              )
              .then(
                (res) =>
                  res.data.success &&
                  toast.success(
                    `Product ${newV ? "added to" : "removed from"} home page`
                  )
              )
              .catch(() => toast.error("Visibility update failed"));
            return { ...p, homeVisibility: newV };
          }
          return p;
        })
      );
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const confirmPrint = () => {
    if (!productToPrint || printQuantity < 1) return;
    const printDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const stickersPerPageCount = Math.min(Math.max(1, stickersPerPage), 8);
    const totalPages = Math.ceil(printQuantity / stickersPerPageCount);
    let printableContent = "";
    for (let page = 0; page < totalPages; page++) {
      printableContent += `<div style="display:grid;grid-template-columns:repeat(${Math.min(
        stickersPerPageCount,
        2
      )},1fr);gap:10px;padding:10px;${
        page < totalPages - 1 ? "page-break-after:always;" : ""
      }">`;
      const stickersOnThisPage = Math.min(
        stickersPerPageCount,
        printQuantity - page * stickersPerPageCount
      );
      for (let i = 0; i < stickersOnThisPage; i++) {
        printableContent += `
          <div style="border:2px solid #000;padding:10px;font-family:Arial;font-size:12px;background:#fff;">
            <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:18px;"><span>MRP</span><span>₹${Number(
              productToPrint.price
            ).toFixed(2)}</span></div>
            ${
              productToPrint.mrp > productToPrint.price
                ? `<div style="font-size:12px;text-decoration:line-through;color:#666;">₹${Number(
                    productToPrint.mrp
                  ).toFixed(2)}</div>`
                : ""
            }
            <div style="font-size:10px;">Inclusive of All Taxes</div>
            <hr style="margin:5px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:12px;"><span>Item No: <strong>${productToPrint._id
              .slice(-6)
              .toUpperCase()}</strong></span><span>Type: <strong>${
          productToPrint.category?.name || "N/A"
        }</strong></span></div>
            <div style="font-weight:bold;text-align:center;margin:4px 0;">${
              productToPrint.name
            }</div>
            <div style="display:flex;justify-content:space-between;font-size:12px;"><span>Size: <strong>${
              productToPrint.size?.join(", ") || "N/A"
            }</strong></span><span>Color: <strong>${
          productToPrint.color || "N/A"
        }</strong></span></div>
            ${
              productToPrint.fabric
                ? `<div style="font-size:12px;">Fabric: <strong>${productToPrint.fabric}</strong></div>`
                : ""
            }
            <div style="text-align:center;margin-top:5px;">${
              productToPrint.barcode
                ? `<img src="${productToPrint.barcode}" style="height:40px;object-fit:contain;" alt="barcode"/>`
                : `<div style="height:40px;display:flex;align-items:center;justify-content:center;color:#666;">[Barcode Not Available]</div>`
            }<div style="letter-spacing:2px;font-family:monospace;font-size:10px;">${productToPrint._id
          .slice(-6)
          .toUpperCase()}</div></div>
            <div style="text-align:center;margin-top:5px;font-weight:bold;font-size:16px;">BURKA COLLECTION</div>
            <div style="font-size:10px;line-height:1.2;text-align:center;">Printed on: ${printDate}<br/>Customer Care: +91 1234567890<br/>Address- Ghetal gali Sironj disit vidhisha</div>
          </div>`;
      }
      printableContent += `</div>`;
    }
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<html><head><title>${productToPrint.name} - Price Tags</title><style>@page{size:A4;margin:0;}@media print{body{margin:0;padding:0;width:210mm;height:297mm;}}</style></head><body onload="window.print();window.close();">${printableContent}</body></html>`
    );
    printWindow.document.close();
    setShowPrintDialog(false);
    setProductToPrint(null);
    setPrintQuantity(1);
  };

  /* ------------- EFFE CTS ------------- */

  useEffect(() => {
    if (!editingProduct) return;
    setEditFormData({
      name: editingProduct.name || "",
      price: editingProduct.price ?? "",
      mrp: editingProduct.mrp ?? "",
      description: editingProduct.description || "",
      
      column: editingProduct.column || "",
    rack: editingProduct.rack || "",
      fabric: editingProduct.fabric || "",
      size: Array.isArray(editingProduct.size) ? editingProduct.size : [],

      // category: editingProduct.category?.name || "",
      // subCategory: editingProduct.subCategory?.name || "",
      category: {
        _id: editingProduct.category?._id || "",
        name: editingProduct.category?.name || "",
      },
      subCategory: {
        _id: editingProduct.subCategory?._id || "",
        name: editingProduct.subCategory?.name || "",
      },
      stock: editingProduct.stock ?? 0,
      homeVisibility: Boolean(editingProduct.homeVisibility),
      images: Array.isArray(editingProduct.images)
        ? [...editingProduct.images]
        : [],
      existingImages: Array.isArray(editingProduct.images)
        ? [...editingProduct.images]
        : [],
    });
    setNewImages([]);
  }, [editingProduct]);

  useEffect(() => {
    loadProducts();
  }, []);

  /* ------------- CART ------------- */
  const addToCart = async (productId, quantity = 1) => {
    const product = products.find((p) => p._id === productId);
    if (!product || product.stock <= 0) return;
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/cart/add/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      await fetchCart();
      toast.success("Product added to cart");
    } catch (err) {
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCartClick = (product) => {
    if (product.stock <= 0) return;
    addToCart(product._id, 1);
  };
const handleExport = () => {
  const data = filteredProducts.map(product => ({
    Name: product.name,
    Price: product.price,
    MRP: product.mrp,
    Stock: product.stock,
    Category: product.category?.name || "",
    Sizes: product.size?.join(", ") || "",
    Color: product.color || "",
    Fabric: product.fabric || "",
    Rack: product.rack || "",
    Column: product.column || "",
    Description: product.description || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  XLSX.writeFile(workbook, "products.xlsx");
};

// Import Handler
const handleImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log("Imported Data:", jsonData);
    // 🔄 Update your product state here or call an API to store in DB
  };
  reader.readAsArrayBuffer(file);
};
  /* ------------- RENDER ------------- */
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditModalClose = () => {
    setEditingProduct(null);
    setNewImages([]);
    setEditFormData({
      name: "",
      price: "",
      mrp: "",
      description: "",
      color: "",
      fabric: "",
      size: [],
      category: "",
      subCategory: "",
      stock: "",
      homeVisibility: false,
      images: [],
      existingImages: [],
     
      column:"",
       rack:"",
    });
  };

  const handleRemoveImage = async (imageUrl) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/product/remove-image/${
          editingProduct._id
        }`,
        { imageUrl }
      );

      if (res.status === 200) {
        toast.success("Image removed successfully");

        // ✅ Correct: BOTH arrays updated
        setEditingProduct((prev) => ({
          ...prev,
          images: (prev?.images || []).filter((img) => img !== imageUrl),
          existingImages: (prev?.existingImages || []).filter(
            (img) => img !== imageUrl
          ),
        }));

        setEditFormData((prev) => ({
          ...prev,
          images: (prev?.images || []).filter((img) => img !== imageUrl),
          existingImages: (prev?.existingImages || []).filter(
            (img) => img !== imageUrl
          ),
        }));
      } else {
        toast.error("Could not remove image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

   
  return (
    <div className='bg-white shadow rounded-lg max-w-5xl py-8'>
      {/* PRINT DIALOG */}
      {showPrintDialog && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full'>
            <h2 className='text-xl font-bold mb-2'>Print Price Tags</h2>
            <input
              type='number'
              min='1'
              value={printQuantity}
              onChange={(e) =>
                setPrintQuantity(Math.max(1, +e.target.value || 1))
              }
              className='w-full border px-3 py-2 rounded mb-2'
            />
            <select
              value={stickersPerPage}
              onChange={(e) => setStickersPerPage(+e.target.value)}
              className='w-full border px-3 py-2 rounded mb-4'
            >
              {[1, 2, 4, 6, 8].map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowPrintDialog(false)}
                className='bg-gray-200 px-4 py-2 rounded'
              >
                Cancel
              </button>
              <button
                onClick={confirmPrint}
                className='bg-primary-600 text-white px-4 py-2 rounded'
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
     <div className='px-6 py-4 border-b flex justify-between items-center'>
  <ToastContainer />

  {/* Left side - Title + Refresh */}
  <div className="flex items-center gap-4">
    <h2 className='text-xl font-bold flex items-center'>
      <Package className='mr-2' size={24} />
      Product List
    </h2>
    <button onClick={loadProducts} title='Refresh'>
      <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
    </button>
  </div>

  {/* Right side - Export and Import */}
  <div className="flex gap-2">
    {/* Export Button with SVG */}
    <button
      onClick={handleExport}
      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Excel
    </button>

    {/* Import Excel */}
    <label className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition">
      <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v-4m0 0V5m0 5l-3-3m3 3l3-3m6 8a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Import
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleImport}
        className="hidden"
      />
    </label>
  </div>
</div>


      {/* SEARCH */}
      <div className='p-4 border-b'>
        <div className='relative'>
          <Search
            size={18}
            className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary-500'
          />
        </div>
      </div>

      {/* LOADING / ERROR / GRID */}
      {loading ? (
        <div className='flex justify-center items-center p-8'>
          <RefreshCw size={24} className='animate-spin text-primary-600' />
          <span className='ml-2'>Loading...</span>
        </div>
      ) : error ? (
        <div className='p-8 text-center text-red-600'>{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className='p-8 text-center text-gray-500'>
          {searchTerm
            ? "No products match your search."
            : "No products available."}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
            {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="h-[100%]"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <Package size={48} />
                      <span className="text-sm mt-2">No image</span>
                    </div>
                  )}
                </div>

                {product.mrp && product.price && product.mrp > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex space-x-1">
                    <button
                      className={`p-1.5 rounded-full ${
                        product.stock <= 0
                          ? "bg-gray-200 cursor-not-allowed"
                          : addingToCart[product._id]
                          ? "bg-gray-200"
                          : "bg-primary-50 hover:bg-primary-100"
                      }`}
                      onClick={() => handleAddToCartClick(product)}
                      disabled={product.stock <= 0 || addingToCart[product._id]}
                      title={product.stock <= 0 ? "Out of Stock" : "Add to cart"}
                    >
                      {addingToCart[product._id] ? (
                        <RefreshCw size={16} className="text-primary-600 animate-spin" />
                      ) : (
                        <ShoppingCart size={16} className={product.stock <= 0 ? "text-gray-400" : "text-primary-600"} />
                      )}
                    </button>
                    <button
                      className="p-1.5 rounded-full bg-green-50 hover:bg-green-100"
                      onClick={() => handlePrintProduct(product)}
                      title="Print product details"
                    >
                      <Printer size={16} className="text-green-600" />
                    </button>
                    <button
                      className="p-1.5 rounded-full bg-yellow-50 hover:bg-yellow-100"
                      onClick={() => setEditingProduct(product)}
                      title="Edit product"
                    >
                      <Edit size={16} className="text-yellow-600" />
                    </button>
                    <button
                      className="p-1.5 rounded-full bg-red-50 hover:bg-red-100"
                      onClick={() => deleteP(product._id)}
                      title="Delete product"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                    <button
                      className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100"
                      onClick={() => setSelectedProduct(product)}
                      title="View details"
                    >
                      <Info size={16} className="text-blue-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleHomeVisibility(product._id, product.homeVisibility)}
                    className={`p-1.5 rounded-full ${
                      product.homeVisibility
                        ? "bg-purple-100 hover:bg-purple-200 text-purple-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                    title={product.homeVisibility === "true" ? "Visible on home" : "Hidden from home"}
                  >
                    <Home size={16} />
                  </button>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-primary-600 font-bold text-lg">
                    ₹{Number.parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="ml-2 text-gray-500 text-sm line-through">
                      ₹{Number.parseFloat(product.mrp).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 animate-pulse">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
                      {product.stock} in Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {product.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 text-black">
                      <Tag size={12} className="mr-1" />
                      {product.category.name}
                    </span>
                  )}

                  {product.size && product.size.length > 0 && (
                    <div className="flex gap-1 ml-auto">
                      {product.size.map((size) => (
                        <span key={size} className="inline-block px-1.5 py-0.5 text-xs border border-gray-300 rounded text-black">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {(product.color || product.fabric) && (
                  <div className="text-sm text-gray-600 mb-2">
                    {product.color && <span>{product.color}</span>}
                    {product.color && product.fabric && <span> • </span>}
                    {product.fabric && <span>{product.fabric}</span>}
                  </div>
                )}
                {(product.rack || product.column) && (
  <div className="text-sm text-gray-600 mb-2">
    {product.rack && <span>Rack: {product.rack}</span>}
    {product.rack && product.column && <span> • </span>}
    {product.column && <span>Column: {product.column}</span>}
  </div>
)}

                {/* {product.description && <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>} */}
                {product.description && (
  <div
    className="text-sm text-gray-500 line-clamp-2"
    dangerouslySetInnerHTML={{ __html: product.description }}
  />
)}

              </div>

              {product.barcode && (
                <div className="bg-gray-50 p-2 flex justify-center border-t border-gray-200">
                  <img
                    src={product.barcode || "/placeholder.svg"}
                    alt={`QR Code for ${product.name}`}
                    className="h-24 w-96 object-contain scale-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedProduct && (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
    <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{selectedProduct.name}</h2>
          <button onClick={() => setSelectedProduct(null)}>
            <X size={24} />
          </button>
        </div>

        {/* Image Preview */}
        {selectedProduct.images?.length ? (
          <div className='grid grid-cols-4 gap-2 mb-6'>
            {/* Main Image */}
            <img
              src={selectedProduct.images[0]}
              className='col-span-4 h-64 object-contain bg-gray-100 rounded-lg cursor-pointer'
              alt={selectedProduct.name}
              onClick={() => setPreviewImage(selectedProduct.images[0])}
            />

            {/* Thumbnails as Circles */}
            {selectedProduct.images.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img}
                className='h-16 w-16 object-cover bg-gray-300 rounded-full cursor-pointer border border-gray-300'
                alt={`${selectedProduct.name} ${idx + 2}`}
                onClick={() => setPreviewImage(img)}
              />
            ))}
          </div>
        ) : (
          <div className='h-64 bg-gray-300 flex items-center justify-center mb-6'>
            <Package size={64} className='text-gray-400' />
          </div>
        )}

        {/* Price and Discount */}
        <div className='flex items-baseline mb-4'>
          <span className='text-primary-600 font-bold text-2xl'>
            ₹{Number(selectedProduct.price).toFixed(2)}
          </span>
          {selectedProduct.mrp > selectedProduct.price && (
            <>
              <span className='ml-2 text-lg text-gray-500 line-through'>
                ₹{Number(selectedProduct.mrp).toFixed(2)}
              </span>
              <span className='ml-2 bg-red-100 text-red-800 text-sm px-2 rounded'>
                {Math.round(
                  ((selectedProduct.mrp - selectedProduct.price) /
                    selectedProduct.mrp) *
                    100
                )}
                % OFF
              </span>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className='grid grid-cols-2 gap-4 mb-6'>
          {selectedProduct.category && (
            <div>
              <h3 className='text-sm text-gray-500'>Category</h3>
              <p>{selectedProduct.category.name}</p>
            </div>
          )}
          {selectedProduct.subCategory && (
            <div>
              <h3 className='text-sm text-gray-500'>Sub-Category</h3>
              <p>{selectedProduct.subCategory.name}</p>
            </div>
          )}
          {selectedProduct.color && (
            <div>
              <h3 className='text-sm text-gray-500'>Color</h3>
              <p>{selectedProduct.color}</p>
            </div>
          )}
          {selectedProduct.fabric && (
            <div>
              <h3 className='text-sm text-gray-500'>Fabric</h3>
              <p>{selectedProduct.fabric}</p>
            </div>
          )}
          {selectedProduct.column && (
            <div>
              <h3 className='text-sm text-gray-500'>Column</h3>
              <p>{selectedProduct.column}</p>
            </div>
          )}
          {selectedProduct.rack && (
            <div>
              <h3 className='text-sm text-gray-500'>Rack</h3>
              <p>{selectedProduct.rack}</p>
            </div>
          )}
          {selectedProduct.size?.length && (
            <div>
              <h3 className='text-sm text-gray-500'>Sizes</h3>
              <div className='flex gap-2 mt-1 flex-wrap'>
                {selectedProduct.size.map((s) => (
                  <span key={s} className='px-2 py-1 border rounded'>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {selectedProduct.description && (
          <div className='mb-6'>
            <h3 className='text-lg font-medium mb-2'>Description</h3>
            <p className='text-gray-600'>{selectedProduct.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-3 flex-wrap'>
          <button
            onClick={() => handleAddToCartClick(selectedProduct)}
            disabled={selectedProduct.stock <= 0}
            className={`flex-1 py-2 px-4 rounded text-white ${
              selectedProduct.stock <= 0
                ? 'bg-gray-400'
                : 'bg-primary-600'
            }`}
          >
            {selectedProduct.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={() => {
              setEditingProduct(selectedProduct);
              setSelectedProduct(null);
            }}
            className='bg-yellow-50 px-4 py-2 rounded'
          >
            Edit
          </button>
          <button
            onClick={() => deleteP(selectedProduct._id)}
            className='bg-red-50 px-4 py-2 rounded'
          >
            Delete
          </button>
          <button
            onClick={() => {
              handlePrintProduct(selectedProduct);
              setSelectedProduct(null);
            }}
            className='bg-green-50 px-4 py-2 rounded'
          >
            Print
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Fullscreen Image Preview */}
{previewImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onClick={() => setPreviewImage(null)}
  >
    <div
      className="relative max-w-3xl w-full p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-0 text-black text-1xl font-bold"
        onClick={() => setPreviewImage(null)}
      >
        &times;
      </button>
      <img
        src={previewImage}
        alt="Preview"
        className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
      />
    </div>
  </div>
)}


      {/* EDIT MODAL */}
      {editingProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold'>Edit Product</h2>
                <button onClick={handleEditModalClose}>
                  <X size={24} />
                </button>
              </div>

              {/* IMAGES SECTION */}
           <div>
  <label className='block text-sm font-medium text-gray-700 mb-2'>
    Product Images
  </label>

  {/* Existing images */}
  <div className='flex flex-wrap gap-4 mb-4'>
    {editingProduct?.images?.map((url, index) => (
      <div key={`existing-${index}`} className='relative group'>
        {/* ✅ Click image to open in new tab */}
        <a href={url} target='_blank' rel='noopener noreferrer'>
          <img
            src={url}
            alt={`Product Image ${index + 1}`}
            className='h-24 w-24 object-cover rounded-md border cursor-pointer hover:scale-105 transition-transform'
          />
        </a>
        <button
          type='button'
          onClick={() => handleRemoveImage(url)}
          className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-80 hover:opacity-100 transition-opacity'
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>

  {/* Newly uploaded images preview */}
  {newImages.length > 0 && (
    <div className='flex flex-wrap gap-4 mb-4'>
      {newImages.map((file, index) => (
        <div key={`new-${index}`} className='relative group'>
          <img
            src={URL.createObjectURL(file)}
            alt={`new-${index}`}
            className='h-24 w-24 object-cover rounded-md border'
          />
          <button
            type='button'
            onClick={() => {
              const updated = [...newImages];
              updated.splice(index, 1);
              setNewImages(updated);
            }}
            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-80 hover:opacity-100 transition-opacity'
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Upload area */}
  <label
    className={`flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary-500 ${
      (editingProduct?.existingImages?.length || 0) + newImages.length >= 5
        ? 'opacity-50 cursor-not-allowed'
        : ''
    }`}
  >
    <div className='flex flex-col items-center space-y-2'>
      <Upload size={24} className='text-gray-500' />
      <span className='font-medium text-gray-600'>
        Drop files or <span className='text-primary-600 underline'>browse</span>
      </span>
      <span className='text-xs text-gray-500'>
        {(editingProduct?.existingImages?.length || 0) + newImages.length >= 5
          ? 'Maximum 5 images'
          : `Up to 5 images (${(editingProduct?.existingImages?.length || 0) + newImages.length}/5)`}
      </span>
    </div>
    <input
      type='file'
      accept='image/*'
      multiple
      onChange={(e) => {
        const files = Array.from(e.target.files);
        const total =
          (editingProduct?.existingImages?.length || 0) + newImages.length + files.length;

        if (total > 5) {
          toast.error('Maximum 5 images allowed');
          return;
        }

        setNewImages((prev) => [...prev, ...files]);
      }}
      className='hidden'
      disabled={
        (editingProduct?.existingImages?.length || 0) + newImages.length >= 5
      }
    />
  </label>
</div>


              {/* EDIT FORM */}
              <form onSubmit={handleEditSubmit} className='mt-4 space-y-4'>
                <div>
                  <label className='block text-sm font-medium'>
                    Product Name
                  </label>
                  <input
                    type='text'
                    value={editFormData.name || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        name: e.target.value,
                      })
                    }
                    className='w-full border rounded px-3 py-2'
                    required
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium'>Price</label>
                    <input
                      type='number'
                      value={editFormData.price || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: e.target.value,
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>MRP</label>
                    <input
                      type='number'
                      value={editFormData.mrp || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          mrp: e.target.value,
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                    />
                  </div>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium'>Stock</label>
                    <input
                      type='number'
                      value={editFormData.stock || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stock: e.target.value,
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                      min='0'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>Color</label>
                    <input
                      type='text'
                      value={editFormData.color || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          color: e.target.value,
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                    />
                  </div>
                </div>
               <div className='grid grid-cols-2 gap-4'>
  <div>
    <label className='block text-sm font-medium'>Rack</label>
    <input
      type='number'
      value={editFormData.rack ?? ""}
      onChange={(e) =>
        setEditFormData((prev) => ({
          ...prev,
          rack: e.target.value === "" ? "" : Number(e.target.value),
        }))
      }
      className='w-full border rounded px-3 py-2'
      required
    />
  </div>

  <div>
    <label className='block text-sm font-medium'>Column</label>
    <input
      type='number'
      value={editFormData.column ?? ""}
      onChange={(e) =>
        setEditFormData((prev) => ({
          ...prev,
          column: e.target.value === "" ? "" : Number(e.target.value),
        }))
      }
      className='w-full border rounded px-3 py-2'
      required
    />
  </div>
</div>

                
                
                
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium'>Fabric</label>
                    <input
                      type='text'
                      value={editFormData.fabric || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fabric: e.target.value,
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>
                      Sizes (comma separated)
                    </label>
                    <input
                      type='text'
                      value={editFormData.size.join(",") || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          size: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium'>Category</label>
                  <input
                    type='text'
                    value={editFormData.category.name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: {
                          ...editFormData.category,
                          name: e.target.value, // agar allow karna hai
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium'>
                    Sub-Category
                  </label>
                  <input
                    type='text'
                    value={editFormData.subCategory.name || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        subCategory: {
                          ...editFormData.subCategory,
                          name: e.target.value, // agar allow karna hai
                        },
                      })
                    }
                    className='w-full border rounded px-3 py-2'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium'>
                    Description
                  </label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editFormData.description || ""}
                    onChange={(event, editor) =>
                      setEditFormData({
                        ...editFormData,
                        description: editor.getData(),
                      })
                    }
                  />
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={editFormData.homeVisibility || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        homeVisibility: e.target.checked,
                      })
                    }
                    className='mr-2'
                  />
                  <label>Show on Home Page</label>
                </div>

                <div className='flex gap-3 mt-4'>
                  <button
                    type='submit'
                    className='flex-1 bg-primary-600 text-white py-2 rounded flex items-center justify-center'
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={18} className='animate-spin mr-2' />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type='button'
                    // onClick={() => setEditingProduct(null)}
                    onClick={handleEditModalClose}
                    className='bg-gray-200 text-gray-800 py-2 px-4 rounded'
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <div className="flex gap-2 items-center">
  <button
    onClick={loadProducts}
    title="Refresh"
    className="p-2 bg-gray-100 rounded"
  >
    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
  </button>

  <button
    onClick={exportToExcel}
    className="px-3 py-1 bg-green-100 text-green-800 rounded"
  >
    Export Excel
  </button>

  <button
    onClick={exportToPDF}
    className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
  >
    Export PDF
  </button>
</div>

                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
