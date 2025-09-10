// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { qntyIncrease, qntyDecrease, itemRemove } from '../../src/Redux/CardSlice';
// import { FaShoppingCart } from 'react-icons/fa';

// const CartSection = () => {
//   const cartData = useSelector(state => state.mycart.cart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//     }
//   }, []);

//   const handleNavigation = (e) => {
//     e.preventDefault();
//     navigate("/checkout");
//   };

//   let totalAmount = 0;
//   const cartItems = cartData.map((item) => {
//     const discount = user?.user?.discount || 0;
//     const discountedPrice = item.price - (item.price * discount / 100);
//     const itemTotal = discountedPrice * item.qnty;
//     totalAmount += itemTotal;

//     return (
//       <tr key={item.id}>
//         <td>
//           <button
//             type="button"
//             className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
//             onClick={() => dispatch(itemRemove({ id: item.id }))}
//           >
//             <i className="ph ph-x-circle text-2xl d-flex" />
//             Remove
//           </button>
//         </td>
//         <td>
//           <div className="table-product d-flex align-items-center gap-24">
//             <Link
//               to={`/product-details/${item.id}`}
//               className="table-product__thumb border border-gray-100 rounded-8 flex-center"
//             >
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 style={{ height: '60px' }}
//               />
//             </Link>
//             <div className="table-product__content text-start">
//               <h6 className="title text-lg fw-semibold mb-8">
//                 <Link
//                   to={`/product-details/${item.id}`}
//                   className="link text-line-2"
//                   tabIndex={0}
//                 >
//                   {item.name}
//                 </Link>
//               </h6>
//               {item.size && (
//                 <div className="text-sm text-gray-600">
//                   Size: {item.size}
//                 </div>
//               )}
//             </div>
//           </div>
//         </td>
//         <td>
//           <span className="text-lg h6 mb-0 fw-semibold">₹{discountedPrice.toFixed(2)}</span>
//         </td>
//         <td>
//           <div className="flex-align gap-8">
//             <button
//               className="text-main-600 hover-text-main-800"
//               onClick={() => dispatch(qntyDecrease({ id: item.id }))}
//             >
//               -
//             </button>
//             <span>{item.qnty}</span>
//             <button
//               className="text-main-600 hover-text-main-800"
//               onClick={() => dispatch(qntyIncrease({ id: item.id }))}
//             >
//               +
//             </button>
//           </div>
//         </td>
//         <td>
//           <span className="text-lg h6 mb-0 fw-semibold">₹{itemTotal.toFixed(2)}</span>
//         </td>
//       </tr>
//     );
//   });

//   return (
//     <section className="cart py-80">
//       <div className="container container-lg">
//         <div className="row gy-4">
//           <div className="col-xl-9 col-lg-8">
//             <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
//               <div className="flex-between mb-24">
//                 <h4 className="flex-align gap-12">
//                   <FaShoppingCart /> Your Cart
//                 </h4>
//                 <div className="border-2 border-gray-900 px-12 py-4 rounded-8">
//                   Total: ₹{totalAmount.toFixed(2)}
//                 </div>
//               </div>
//               <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
//                 <table className="table style-three">
//                   <thead>
//                     <tr>
//                       <th className="h6 mb-0 text-lg fw-bold">Delete</th>
//                       <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
//                       <th className="h6 mb-0 text-lg fw-bold">Price</th>
//                       <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
//                       <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cartItems.length > 0 ? cartItems : (
//                       <tr>
//                         <td colSpan="5" className="text-center py-40">
//                           Your cart is empty
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="flex-between flex-wrap gap-16 mt-16">
//                 <div className="flex-align gap-16">
//                   <input
//                     type="text"
//                     className="common-input"
//                     placeholder="Coupon Code"
//                   />
//                   <button
//                     type="submit"
//                     className="btn btn-main py-18 w-100 rounded-8"
//                   >
//                     Apply Coupon
//                   </button>
//                 </div>
//                 <button
//                   type="submit"
//                   className="text-lg text-gray-500 hover-text-main-600"
//                 >
//                   Update Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="col-xl-3 col-lg-4">
//             <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
//               <h6 className="text-xl mb-32">Cart Totals</h6>
//               <div className="bg-color-three rounded-8 p-24">
//                 <div className="mb-32 flex-between gap-8">
//                   <span className="text-gray-900 font-heading-two">Subtotal</span>
//                   <span className="text-gray-900 fw-semibold">₹{totalAmount.toFixed(2)}</span>
//                 </div>
//                 <div className="mb-32 flex-between gap-8">
//                   <span className="text-gray-900 font-heading-two">Estimated Delivery</span>
//                   <span className="text-gray-900 fw-semibold">Free</span>
//                 </div>
//                 <div className="mb-0 flex-between gap-8">
//                   <span className="text-gray-900 font-heading-two">Estimated Tax</span>
//                   <span className="text-gray-900 fw-semibold">Price</span>
//                 </div>
//               </div>
//               <div className="bg-color-three rounded-8 p-24 mt-24">
//                 <div className="flex-between gap-8">
//                   <span className="text-gray-900 text-xl fw-semibold">Total</span>
//                   <span className="text-gray-900 text-xl fw-semibold">₹{totalAmount.toFixed(2)}</span>
//                 </div>
//               </div>
//               <button
//                 onClick={handleNavigation}
//                 className="btn btn-main mt-40 py-18 w-100 rounded-8"
//                 disabled={cartData.length === 0}
//               >
//                 Proceed to checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CartSection;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { qntyIncrease, qntyDecrease, itemRemove } from '../../src/Redux/CardSlice';
import { FaShoppingCart } from 'react-icons/fa';

const CartSection = () => {
  const cartData = useSelector(state => state.mycart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/checkout");
  };

  let totalAmount = 0;
  const cartItems = cartData.map((item) => {
    const discount = user?.user?.discount || 0;
    const discountedPrice = item.price - (item.price * discount / 100);
    const itemTotal = discountedPrice * item.qnty;
    totalAmount += itemTotal;

    // Create unique key by combining product ID and size
    const uniqueKey = `${item.id}-${item.size || 'no-size'}`;

    return (
      <tr key={uniqueKey}>
        <td>
          <button
            type="button"
            className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
            onClick={() => dispatch(itemRemove({ id: item.id, size: item.size }))}
          >
            <i className="ph ph-x-circle text-2xl d-flex" />
            Remove
          </button>
        </td>
        <td>
          <div className="table-product d-flex align-items-center gap-24">
            <Link
              to={`/product-details/${item.id}`}
              className="table-product__thumb border border-gray-100 rounded-8 flex-center"
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ height: '60px' }}
              />
            </Link>
            <div className="table-product__content text-start">
              <h6 className="title text-lg fw-semibold mb-8">
                <Link
                  to={`/product-details/${item.id}`}
                  className="link text-line-2"
                  tabIndex={0}
                >
                  {item.name}
                </Link>
              </h6>
              {item.size && item.size !== "N/A" && (
                <div className="text-sm text-gray-600">
                  Size: {item.size}
                </div>
              )}
            </div>
          </div>
        </td>
        <td>
          <span className="text-lg h6 mb-0 fw-semibold">₹{discountedPrice.toFixed(2)}</span>
        </td>
        <td>
          <div className="flex-align gap-8">
            <button
              className="text-main-600 hover-text-main-800"
              onClick={() => dispatch(qntyDecrease({ id: item.id, size: item.size }))}
            >
              -
            </button>
            <span>{item.qnty}</span>
            <button
              className="text-main-600 hover-text-main-800"
              onClick={() => dispatch(qntyIncrease({ id: item.id, size: item.size }))}
            >
              +
            </button>
          </div>
        </td>
        <td>
          <span className="text-lg h6 mb-0 fw-semibold">₹{itemTotal.toFixed(2)}</span>
        </td>
      </tr>
    );
  });

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-xl-9 col-lg-8">
            <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
              <div className="flex-between mb-24">
                <h4 className="flex-align gap-12">
                  <FaShoppingCart /> Your Cart
                </h4>
                <div className="border-2 border-gray-900 px-12 py-4 rounded-8">
                  Total: ₹{totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                <table className="table style-three">
                  <thead>
                    <tr>
                      <th className="h6 mb-0 text-lg fw-bold">Delete</th>
                      <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
                      <th className="h6 mb-0 text-lg fw-bold">Price</th>
                      <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                      <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length > 0 ? cartItems : (
                      <tr>
                        <td colSpan="5" className="text-center py-40">
                          Your cart is empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex-between flex-wrap gap-16 mt-16">
                <div className="flex-align gap-16">
                  <input
                    type="text"
                    className="common-input"
                    placeholder="Coupon Code"
                  />
                  <button
                    type="submit"
                    className="btn btn-main py-18 w-100 rounded-8"
                  >
                    Apply Coupon
                  </button>
                </div>
                <button
                  type="submit"
                  className="text-lg text-gray-500 hover-text-main-600"
                >
                  Update Cart
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
              <h6 className="text-xl mb-32">Cart Totals</h6>
              <div className="bg-color-three rounded-8 p-24">
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Subtotal</span>
                  <span className="text-gray-900 fw-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Estimated Delivery</span>
                  <span className="text-gray-900 fw-semibold">Free</span>
                </div>
                <div className="mb-0 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Estimated Tax</span>
                  <span className="text-gray-900 fw-semibold">Price</span>
                </div>
              </div>
              <div className="bg-color-three rounded-8 p-24 mt-24">
                <div className="flex-between gap-8">
                  <span className="text-gray-900 text-xl fw-semibold">Total</span>
                  <span className="text-gray-900 text-xl fw-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleNavigation}
                className="btn btn-main mt-40 py-18 w-100 rounded-8"
                disabled={cartData.length === 0}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSection;