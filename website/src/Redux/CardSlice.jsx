// import { createSlice } from "@reduxjs/toolkit";
// import { message } from "antd";

// const cartSlice = createSlice({
//   name: "mycart",
//   initialState: {
//     cart: [],
//   },
//   reducers: {
//     // addtoCart: (state, actions) => {
//     //   let Data = state.cart.filter((key) => key.id == actions.payload.id);
//     //   if (Data.length >= 1) {
//     //     message.error("Product Already Added!!");
//     //   } else {
//     //     state.cart.push(actions.payload);
//     //   }
//     // },

//     addtoCart: (state, actions) => {
//   const existingProduct = state.cart.find((item) => item.id === actions.payload.id);
//   if (existingProduct) {
//     // Agar product already hai to uski quantity badhao
//     existingProduct.quantity += 1;
//     message.success("Product quantity increased!");
//   } else {
//     // Agar product nahi hai to nayi entry karo with quantity = 1
//     state.cart.push({ ...actions.payload, quantity: 1 });
//     message.success("Product added to cart!");
//   }
// },



//     qntyIncrease: (state, actions) => {
//       for (var i = 0; i < state.cart.length; i++) {
//         if (state.cart[i].id == actions.payload.id) {
//           state.cart[i].qnty++;
//         }
//       }
//     },
//     qntyDecrease: (state, actions) => {
//       for (var i = 0; i < state.cart.length; i++) {
//         if (state.cart[i].id == actions.payload.id) {
//           if (state.cart[i].qnty <= 1) {
//             message.error("Quantity not less than 1");
//           } else {
//             state.cart[i].qnty--;
//           }
//         }
//       }
//     },
//     itemRemove: (state, actions) => {
//       state.cart = state.cart.filter((key) => key.id != actions.payload.id);
//     },
//     clearCart: (state) => {
//       state.cart = [];
//     },
//   },
// });

// export const { addtoCart, qntyIncrease, qntyDecrease, itemRemove, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const cartSlice = createSlice({
  name: "mycart",
  initialState: {
    cart: [],
  },
  reducers: {
    addtoCart: (state, action) => {
      const { id, size } = action.payload;
      
      // Check if the same product with same size already exists
      const existingItem = state.cart.find(
        item => item.id === id && item.size === size
      );

      if (existingItem) {
        // If exists, increase quantity
        existingItem.qnty += 1;
        message.success(`${existingItem.name} (Size: ${size}) quantity increased!`);
      } else {
        // If not exists, add new item with quantity 1
        state.cart.push({ ...action.payload, qnty: 1 });
        message.success(`${action.payload.name} (Size: ${size}) added to cart!`);
      }
    },

    qntyIncrease: (state, action) => {
      const { id, size } = action.payload;
      const item = state.cart.find(
        item => item.id === id && item.size === size
      );
      if (item) {
        item.qnty += 1;
        message.success(`${item.name} (Size: ${size}) quantity increased!`);
      }
    },

    qntyDecrease: (state, action) => {
      const { id, size } = action.payload;
      const item = state.cart.find(
        item => item.id === id && item.size === size
      );
      if (item) {
        if (item.qnty > 1) {
          item.qnty -= 1;
          message.success(`${item.name} (Size: ${size}) quantity decreased!`);
        } else {
          message.error("Quantity cannot be less than 1");
        }
      }
    },
 itemRemove: (state, action) => {
      const { id, size = "N/A" } = action.payload;
      const initialLength = state.cart.length;
      
      state.cart = state.cart.filter(
        item => !(item.id === id && item.size === size)
      );
      
      if (state.cart.length < initialLength) {
        const removedItem = action.payload;
        message.success(`${removedItem.name || 'Item'} (Size: ${size}) removed from cart!`);
      }
    },

    clearCart: (state) => {
      state.cart = [];
      message.success("Cart cleared successfully!");
    },
  },
});

export const { addtoCart, qntyIncrease, qntyDecrease, itemRemove, clearCart } = cartSlice.actions;
export default cartSlice.reducer;