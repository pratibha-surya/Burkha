import React from "react";
import { Button, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-pink-100 px-4 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 top-[-100px] left-[-100px] z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 bottom-[-100px] right-[-100px] z-0"></div>

      {/* Thank You Card */}
      <div className="w-full max-w-xl text-center relative p-8 md:p-12 bg-white rounded-3xl shadow-2xl z-10">
        
        {/* Title */}
        <h1
          className="text-[48px] md:text-[64px] font-[900] italic leading-tight text-black drop-shadow mb-2"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Thank you
        </h1>

        <Typography
          variant="h6"
          component="p"
          className="text-orange-500 font-semibold text-[20px] md:text-[24px] italic -mt-2 mb-6"
        >
          for your order
        </Typography>

        {/* Body Message */}
        <div className="text-[16px] md:text-[18px] font-medium text-gray-700 space-y-2">
          <p>Your order made our day! We hope we make yours.</p>
          <p>Enjoy your free gift 🎁</p>
          <p>
            If you have any <span className="lowercase">question</span> about your order,
          </p>
          <p>contact us anytime. We'd love to hear from you!</p>
        </div>

        {/* CTA Button with MUI */}
        <div className="mt-8">
          <Button
            variant="contained"
            color="warning"
            size="large"
            endIcon={<ShoppingCartIcon />}
            onClick={() => (window.location.href = "/shop")}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              boxShadow: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
