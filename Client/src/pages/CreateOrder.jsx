import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateOrder = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

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
      },
    ],
    totalPrice: 0,
    totalPriceAfterDiscount: 0,
    amountPaid: 0,
    dueAmount: 0,
    paymentStatus: 'pending',
    status: 'pending',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getVendorId = (v) => v?._id || v?.id || v?.vendorId || '';
  const getProductId = (p) => p?._id || p?.id || p?.productId || '';
  const getProductName = (p) => p?.name || p?.productName || p?.title || 'Unknown';
  const getProductPrice = (p) => Number(p?.price ?? p?.sellingPrice ?? p?.mrp ?? 0) || 0;
  const getProductImage = (p) => (p?.images && p.images[0]) || p?.image || p?.imageUrl || '';

  useEffect(() => {
    fetchVendors();
    fetchProducts();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
      const data = res?.data || {};
      const list = data.users || data.vendors || (Array.isArray(data) ? data : []);
      setVendors(list);
    } catch (err) {
      toast.error('Failed to load vendors');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/product`);
      const data = res?.data || {};
      const list = data.products || data.product || data.data || (Array.isArray(data) ? data : []);
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const calculateTotals = (orderItems, amountPaid = formData.amountPaid) => {
    const totalPrice = orderItems.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0);
    const totalPriceAfterDiscount = orderItems.reduce((sum, it) => {
      const discountPct = Number(it.discountPercentage) || 0;
      const discountedUnitPrice = it.price * (1 - discountPct / 100);
      return sum + discountedUnitPrice * Number(it.quantity);
    }, 0);
    const dueAmount = totalPriceAfterDiscount - Number(amountPaid);

    setFormData((prev) => ({
      ...prev,
      totalPrice: Number(totalPrice.toFixed(2)),
      totalPriceAfterDiscount: Number(totalPriceAfterDiscount.toFixed(2)),
      dueAmount: Number(dueAmount.toFixed(2)),
      paymentStatus: Number(dueAmount) <= 0 ? 'paid' : 'pending',
    }));
  };

  const handleVendorChange = (e) => {
    const vendorId = e.target.value;
    const vendorObj = vendors.find((v) => getVendorId(v) === vendorId) || null;
    setSelectedVendor(vendorObj);
    const updatedItems = formData.orderItems.map((item) => ({
      ...item,
      discountPercentage: vendorObj?.discount || 0,
    }));
    setFormData((prev) => ({
      ...prev,
      vendor: vendorId,
      orderItems: updatedItems,
    }));
    calculateTotals(updatedItems, formData.amountPaid);
  };

  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    const newItems = [...formData.orderItems];

    if (name === 'productId') {
      const p = products.find((pr) => getProductId(pr) === value);
      const basePrice = getProductPrice(p);
      const vendorDiscount = selectedVendor?.discount || 0;
      newItems[i] = {
        ...newItems[i],
        productId: value,
        productName: getProductName(p),
        price: basePrice,
        productImage: getProductImage(p),
        discountPercentage: vendorDiscount,
      };
    } else if (name === 'discountPercentage') {
      const d = Math.min(100, Math.max(0, parseFloat(value) || 0));
      newItems[i] = { ...newItems[i], discountPercentage: d };
    } else if (name === 'quantity') {
      const q = Math.max(1, parseInt(value || '1', 10));
      newItems[i] = { ...newItems[i], quantity: q };
    } else {
      newItems[i] = { ...newItems[i], [name]: value };
    }

    setFormData((prev) => ({ ...prev, orderItems: newItems }));
    calculateTotals(newItems, formData.amountPaid);
  };

  const addOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          productId: '',
          productName: '',
          price: 0,
          quantity: 1,
          productImage: '',
          discountPercentage: selectedVendor?.discount || 0,
        },
      ],
    }));
  };

  const removeOrderItem = (i) => {
    if (formData.orderItems.length > 1) {
      const newItems = formData.orderItems.filter((_, idx) => idx !== i);
      setFormData((prev) => ({ ...prev, orderItems: newItems }));
      calculateTotals(newItems, formData.amountPaid);
    }
  };

  const handleAmountPaidChange = (e) => {
    let amount = Number(e.target.value) || 0;
    amount = Math.min(amount, formData.totalPriceAfterDiscount);
    setFormData((prev) => ({ ...prev, amountPaid: amount }));
    calculateTotals(formData.orderItems, amount);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.vendor) errs.vendor = 'Please select a vendor';
    formData.orderItems.forEach((it, i) => {
      if (!it.productId) errs[`product_${i}`] = 'Please select a product';
      if (it.quantity <= 0) errs[`quantity_${i}`] = 'Quantity must be at least 1';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vendor: formData.vendor,
        orderItems: formData.orderItems.map((it) => {
          const discount = Number(it.discountPercentage) || 0;
          const discountedUnitPrice = it.price * (1 - discount / 100);
          const priceAfterDiscount = Number((discountedUnitPrice * it.quantity).toFixed(2));
          return {
            productId: it.productId,
            productName: it.productName,
            price: Number(it.price),
            quantity: Number(it.quantity),
            productImage: it.productImage,
            discountPercentage: discount,
            priceAfterDiscount: priceAfterDiscount,
          };
        }),
        totalPrice: formData.totalPrice,
        totalPriceAfterDiscount: formData.totalPriceAfterDiscount,
        amountPaid: formData.amountPaid,
        dueAmount: formData.dueAmount,
        paymentStatus: formData.paymentStatus,
        status: formData.status,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/order`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Order created!');
      navigate('/orders');
    } catch (err) {
      toast.error('Failed to create order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Vendor Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Vendor *</label>
            <select
              value={formData.vendor}
              onChange={handleVendorChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select vendor</option>
              {vendors.map((v) => (
                <option key={getVendorId(v)} value={getVendorId(v)}>
                  {v.firmName || v.name} (Discount: {v.discount ?? 0}%)
                </option>
              ))}
            </select>
            {errors.vendor && <p className="text-red-500 text-sm">{errors.vendor}</p>}
          </div>

          {/* Order Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order Items</h3>
              <button
                type="button"
                onClick={addOrderItem}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Item
              </button>
            </div>

            {formData.orderItems.map((item, i) => (
              <div key={i} className="border p-4 mb-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Product select */}
                  <div>
                    <label>Product *</label>
                    <select
                      name="productId"
                      value={item.productId}
                      onChange={(e) => handleInputChange(e, i)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={getProductId(p)} value={getProductId(p)}>
                          {getProductName(p)} - ₹{getProductPrice(p)}
                        </option>
                      ))}
                    </select>
                    {errors[`product_${i}`] && (
                      <p className="text-red-500 text-sm">{errors[`product_${i}`]}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, i)}
                      className="w-full border rounded px-2 py-1"
                      min="1"
                    />
                    {errors[`quantity_${i}`] && (
                      <p className="text-red-500 text-sm">{errors[`quantity_${i}`]}</p>
                    )}
                  </div>

                  {/* Discount */}
                  {false?(

                  
                  
                  <div>
                    <label>Discount %</label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={item.discountPercentage}
                      onChange={(e) => handleInputChange(e, i)}
                      className="w-full border rounded px-2 py-1"
                      min="0"
                      max="100"
                    />
                  </div>
                  ):null
}

                  {/* Remove button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeOrderItem(i)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount Paid</label>
            <input
              type="number"
              value={formData.amountPaid}
              onChange={handleAmountPaidChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded">
            <p>Total: ₹{formData.totalPrice.toFixed(2)}</p>
            <p>After Discount: ₹{formData.totalPriceAfterDiscount.toFixed(2)}</p>
            <p>Paid: ₹{formData.amountPaid.toFixed(2)}</p>
            <p className={`font-bold ${formData.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              Due: ₹{formData.dueAmount.toFixed(2)} ({formData.paymentStatus})
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
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
