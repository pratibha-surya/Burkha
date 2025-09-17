import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const catalogueRef = useRef(); // Reference to the catalogue div

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product`);
        console.log("API Response:", response.data);

        let productsArray = [];

        if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data.products && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsArray = response.data.data;
        } else if (response.data.data?.items && Array.isArray(response.data.data.items)) {
          productsArray = response.data.data.items;
        } else {
          console.warn("Unknown data structure for products");
        }

        setProducts(productsArray);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // PDF export function
  const exportToPDF = async () => {
    const input = catalogueRef.current;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft > 0) pdf.addPage();
      }
    }

    pdf.save("product-catalogue.pdf");
  };

  // UI rendering
  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* PDF Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToPDF}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
        >
          <svg
            className="-ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11v6m0 0l-3-3m3 3l3-3m5 4V5a2 2 0 00-2-2H8l-4 4v12a2 2 0 002 2h12a2 2 0 002-2z"
            />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Catalogue Products + Header */}
      <div
        ref={catalogueRef}
        className="bg-white p-6 rounded shadow"
      >
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Product Catalogue</h1>
          <p className="text-gray-600 text-lg">
            Explore our range of products with prices and images.
          </p>
          <hr className="mt-4 border-gray-300" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id || product.id}
                className="border rounded-md p-4 shadow hover:shadow-lg transition bg-white"
              >
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].url || product.images[0]
                      : "/placeholder.png"
                  }
                  alt={product.name || "Product Image"}
                  className="w-full h-48 object-cover rounded"
                  crossOrigin="anonymous" // Important for PDF
                />
                <h3 className="mt-2 font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-700 mt-1">MRP: ₹{product.mrp}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
