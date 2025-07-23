// controllers/parseProductData.js

const parseProductData = (body) => {
  const {
    name,
    price,
    mrp,
    description,
    color,
    fabric,
    size,
    stock,
    homeVisibility,
    category,
    subCategory,
    existingImages,
    images,
    barcodeNumber,
  } = body;

  return {
    name,
    price,
    mrp,
    description,
    color,
    fabric,
    size: size
      ? typeof size === "string"
        ? JSON.parse(size)
        : size
      : undefined,
    stock,
    homeVisibility:
      typeof homeVisibility === "string"
        ? homeVisibility === "true"
        : homeVisibility,
    category,
    subCategory,
    existingImages: existingImages
      ? typeof existingImages === "string"
        ? JSON.parse(existingImages)
        : existingImages
      : undefined,
    images,
    barcodeNumber,
  };
};

module.exports = parseProductData;
