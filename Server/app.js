require("dotenv").config();
const express = require("express");
const app = express();
const dbconnect = require("./config/db.config");
const morgan = require("morgan");
const cors = require("cors");
const productRouter = require("./routes/product.routes");
const cartRouter = require("./routes/cart.routes");
const categoryRouter = require("./routes/category.routes");
const subacategoryRouter = require("./routes/subcategory.routes");
const fileUpload = require("express-fileupload");
const UserRegistration = require("./routes/RegistartionRoute");
const orderRouter = require("./routes/order.routes");
const paymentRouter = require("./routes/payment.routes");
const purchaseproduct = require("./routes/purchase.routes");
const adminlogin = require("./routes/admin.routes");
const Contact = require("./routes/Contactroutes");
const BrandRoute = require("./routes/BrandRoute");
const UserRoute = require("./routes/userRoute");
const BannerRoute = require("./routes/BannerRoute");
const LoginRoute = require("./routes/userRoute");
const CheckRoute = require("./routes/Checkoutroute");
const PaymentRoute = require("./routes/paymentRoute");


// db connect
dbconnect();

// logging requests
app.use(morgan("dev"));

// allow cors
app.use(cors("http://localhost:3000"));

// file uplaod middleware
app.use(fileUpload());

// json data and form data parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// product routes
app.use("/product", productRouter);

// cart routes
app.use("/cart", cartRouter);

// category routes
app.use("/category", categoryRouter);

// sub category routes
app.use("/subcategory", subacategoryRouter);

// user routes
app.use("/user", UserRegistration);

// order routes
app.use("/order", orderRouter);

// payments routes
app.use("/payments", paymentRouter);

// purchase routes
app.use("/purchase", purchaseproduct);

// admin routes
app.use("/admin", adminlogin);

// contact routes
app.use("/contact", Contact);

// brand routes
app.use("/brand", BrandRoute);

// user Routes
app.use("/user", UserRoute);

// Banner routes
app.use("/banner", BannerRoute);

// auth routes
app.use("/auth", LoginRoute);

// payments user routes
app.use("/paymentuser", PaymentRoute);


app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
