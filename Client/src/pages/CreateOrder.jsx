import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vendor: '',
    orderItems: [
      {
        productId: '',
        productName: '',
        price: 0,
        quantity: 1,
        productImage: '',
        discountPercentage: 0,
        priceAfterDiscount: 0
      }
    ],
    totalPrice: 0,
    totalPriceAfterDiscount: 0,
    dueAmount: 0,
    paymentStatus: 'pending',
    status: 'pending'
  });

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch vendors and products on component mount
  useEffect(() => {
    fetchVendors();
    fetchProducts();
  }, []);

  const getVendorId = (v) => v?._id || v?.id || v?.vendorId || '';

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
      const data = response?.data || {};
      const list = data.users || data.vendors || (Array.isArray(data) ? data : []);
      setVendors(list);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    }
  };

  const getProductId = (p) => p?._id || p?.id || p?.productId || '';
  const getProductName = (p) => p?.name || p?.productName || p?.title || 'Unknown';
  const getProductPrice = (p) => Number(p?.price ?? p?.sellingPrice ?? p?.mrp ?? 0) || 0;
  const getProductImage = (p) => (p?.images && p.images[0]) || p?.image || p?.imageUrl || '';

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/product`);
      const data = response?.data || {};
      const list = data.products || data.product || data.data || (Array.isArray(data) ? data : []);
      setProducts(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newOrderItems = [...formData.orderItems];

    if (name === 'productId') {
      const selectedProduct = products.find(p => getProductId(p) === value);
      if (selectedProduct) {
        const currentDiscount = Number(newOrderItems[index].discountPercentage) || 0;
        const basePrice = getProductPrice(selectedProduct);
        const priceAfterDiscount = basePrice - (basePrice * currentDiscount / 100);
        newOrderItems[index] = {
          ...newOrderItems[index],
          productId: value,
          productName: getProductName(selectedProduct),
          price: basePrice,
          productImage: getProductImage(selectedProduct),
          priceAfterDiscount: Number(priceAfterDiscount.toFixed(2)),
        };
      }
    } else if (name === 'discountPercentage') {
      const discount = Math.min(100, Math.max(0, parseFloat(value))); // clamp 0-100
      const price = Number(newOrderItems[index].price) || 0;
      const priceAfterDiscount = price - (price * (isNaN(discount) ? 0 : discount) / 100);
      newOrderItems[index] = {
        ...newOrderItems[index],
        discountPercentage: isNaN(discount) ? 0 : discount,
        priceAfterDiscount: Number(priceAfterDiscount.toFixed(2))
      };
    } else if (name === 'quantity') {
      const qty = Math.max(1, parseInt(value || '1', 10));
      newOrderItems[index] = {
        ...newOrderItems[index],
        quantity: qty
      };
    } else {
      newOrderItems[index] = {
        ...newOrderItems[index],
        [name]: value
      };
    }

    setFormData(prev => ({
      ...prev,
      orderItems: newOrderItems
    }));

    calculateTotals(newOrderItems);
  };

  const calculateTotals = (orderItems) => {
    const totalPrice = orderItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
    const totalPriceAfterDiscount = orderItems.reduce((sum, item) => sum + ((Number(item.priceAfterDiscount) || 0) * (Number(item.quantity) || 0)), 0);

    setFormData(prev => ({
      ...prev,
      totalPrice: Number(totalPrice.toFixed(2)),
      totalPriceAfterDiscount: Number(totalPriceAfterDiscount.toFixed(2)),
      dueAmount: Number(totalPriceAfterDiscount.toFixed(2))
    }));
  };

  const addOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          productId: '',
          productName: '',
          price: 0,
          quantity: 1,
          productImage: '',
          discountPercentage: 0,
          priceAfterDiscount: 0
        }
      ]
    }));
  };

  const removeOrderItem = (index) => {
    if (formData.orderItems.length > 1) {
      const newOrderItems = formData.orderItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        orderItems: newOrderItems
      }));
      calculateTotals(newOrderItems);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vendor) {
      newErrors.vendor = 'Please select a vendor';
    }

    if (formData.orderItems.length === 0) {
      newErrors.orderItems = 'Please add at least one order item';
    }

    formData.orderItems.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`product_${index}`] = 'Please select a product';
      }
      if (item.quantity <= 0) {
        newErrors[`quantity_${index}`] = 'Quantity must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const selectedVendorObj = vendors.find(v => (v?._id || v?.id) === formData.vendor) || {};

      // sanitize items: keep only those with a productId
      const sanitizedItems = formData.orderItems
        .filter(it => it.productId)
        .map(it => {
          const price = Number(it.price) || 0;
          const quantity = Math.max(1, Number(it.quantity) || 0);
          const discountPercentage = Math.min(100, Math.max(0, Number(it.discountPercentage) || 0));
          const computedAfter = price - (price * discountPercentage / 100);
          const priceAfterDiscount = Number((!isNaN(it.priceAfterDiscount) && Number(it.priceAfterDiscount) > 0 ? Number(it.priceAfterDiscount) : computedAfter).toFixed(2));
          return {
            productId: it.productId,
            productName: it.productName,
            price,
            quantity,
            productImage: it.productImage || '',
            discountName: {
              _id: selectedVendorObj?._id || '',
              firmName: selectedVendorObj?.firmName || '',
              contactName: selectedVendorObj?.contactName || '',
              mobile1: selectedVendorObj?.mobile1 || '',
              mobile2: selectedVendorObj?.mobile2 || '',
              whatsapp: selectedVendorObj?.whatsapp || '',
              email: selectedVendorObj?.email || '',
              address: selectedVendorObj?.address || '',
              city: selectedVendorObj?.city || '',
              state: selectedVendorObj?.state || '',
              limit: selectedVendorObj?.limit || '',
              discount: selectedVendorObj?.discount || 0,
            },
            discountPercentage,
            priceAfterDiscount,
          };
        });

      if (sanitizedItems.length === 0) {
        toast.error('Please add at least one valid order item');
        setLoading(false);
        return;
      }

      const totalPrice = sanitizedItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const totalPriceAfterDiscount = sanitizedItems.reduce((sum, it) => sum + (it.priceAfterDiscount * it.quantity), 0);

      const payload = {
        orderItems: sanitizedItems,
        totalPrice: Number(totalPrice.toFixed(2)),
        totalPriceAfterDiscount: Number(totalPriceAfterDiscount.toFixed(2)),
        dueAmount: Number(totalPriceAfterDiscount.toFixed(2)),
        vendor: formData.vendor,
        paymentStatus: formData.paymentStatus || 'pending',
        status: formData.status || 'pending',
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Order created:', response.data);
      if (response.data?.success === false) {
        throw new Error(response.data?.message || 'Failed to create order');
      }
      toast.success('Order created successfully!');
      navigate('/orders');
    } catch (error) {
      const serverData = error?.response?.data;
      let message = 'Failed to create order';
      if (typeof serverData === 'string') {
        // extract plain text from HTML if needed
        const m = serverData.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
        message = m ? m[1] : serverData;
      } else if (serverData?.message) {
        message = serverData.message;
      } else if (error.message) {
        message = error.message;
      }
      console.error('Error creating order:', message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vendor *
            </label>
            <select
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a vendor</option>
              {vendors.map(vendor => {
                const id = getVendorId(vendor);
                const name = vendor?.firmName || vendor?.name || vendor?.companyName || 'Unknown';
                const contact = vendor?.contactName || vendor?.contact || '';
                return (
                  <option key={id || Math.random()} value={id}>
                    {name}{contact ? ` - ${contact}` : ''}
                  </option>
                );
              })}
            </select>
            {errors.vendor && <p className="text-red-500 text-sm mt-1">{errors.vendor}</p>}
          </div>

          {/* Order Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order Items</h3>
              <button
                type="button"
                onClick={addOrderItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>

            {formData.orderItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {formData.orderItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOrderItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product *
                    </label>
                    <select
                      name="productId"
                      value={item.productId}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a product</option>
                      {products.map(product => {
                        const id = getProductId(product);
                        const label = `${getProductName(product)} - ₹${getProductPrice(product)}`;
                        return (
                          <option key={id || Math.random()} value={id}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                    {errors[`product_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`product_${index}`]}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors[`quantity_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`quantity_${index}`]}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={item.discountPercentage}
                      onChange={(e) => handleInputChange(e, index)}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Price After Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price After Discount
                    </label>
                    <input
                      type="number"
                      value={item.priceAfterDiscount}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  {/* Item Total */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Total
                    </label>
                    <input
                      type="number"
                      value={(item.priceAfterDiscount * item.quantity).toFixed(2)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 font-semibold"
                    />
                  </div>
                </div>
              </div>
            ))}

            {errors.orderItems && (
              <p className="text-red-500 text-sm mt-1">{errors.orderItems}</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Price</label>
                <p className="text-lg font-semibold">₹{formData.totalPrice.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total After Discount</label>
                <p className="text-lg font-semibold">₹{formData.totalPriceAfterDiscount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Amount</label>
                <p className="text-lg font-semibold text-red-600">₹{formData.dueAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;

