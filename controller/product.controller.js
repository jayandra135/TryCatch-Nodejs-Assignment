import ProductModel from "../modal/product.model";
import multer from "multer";
import fs from "fs";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/product")) {
      cb(null, "./uploads/product");
    } else {
      fs.mkdirSync("./uploads/product");
      cb(null, "./uploads/product");
    }
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    const ext = path.extname(name);
    const nameArr = name.split(".");
    nameArr.pop();
    const fname = nameArr.join(".");
    const fullname = fname + "-" + Date.now() + ext;
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });
export const getAllProduct = async (req, res) => {
  try {
    const ProductData = await ProductModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subcategories",
        },
      },
      { $unwind: "$subcategories" },
    ]);
    if (ProductData) {
      return res.status(200).json({
        data: ProductData,
        message: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getProduct = async (req, res) => {
  try {
    const id = req.params.product_id;

    const productData = await ProductModel.findOne({ _id: id });
    // console.log(ProductData.images[0]);

    const image = productData.images.split(",");
    console.log(image[1]);
    for (let i = 0; i < image.length; i++) {
      console.log("jay ", image[i]);
    }
    if (productData) {
      return res.status(200).json({
        data: productData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addProduct = (req, res) => {
  try {
    const uploadData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]);
    console.log(uploadData);
    uploadData(req, res, function (error) {
      if (error) return res.status(400).json({ message: error.message });

      const {
        name,
        category,
        subcategory,
        quantity,
        price,
        shortDescription,
        description,
        status,
      } = req.body;

      let image = [];
      let thumbnail = null;

      if (req.files && req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
      }
      console.log(req.files);
      if (req.files && req.files["images"]) {
        req.files["images"].forEach((file) => {
          image.push(file.filename);
        });
      }

      const createdRecord = new ProductModel({
        name: name,
        category: category,
        subCategory: subcategory,
        quantity: quantity,
        price: price,
        shortDescription: shortDescription,
        description: description,
        thumbnail: thumbnail,
        images: image.join(","),
        status: status,
      });

      createdRecord.save();
      console.log(createdRecord.images);

      if (createdRecord) {
        return res.status(201).json({
          data: createdRecord,
          message: "Success",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.product_id;

    const productImage = await ProductModel.findOne({ _id: id });
    let image = productImage.images.split(",");

    //console.log(image);

    for (let i = 0; i < image.length; i++) {
      if (fs.existsSync("./uploads/product/" + image[i])) {
        fs.unlinkSync("./uploads/product/" + image[i]);
      }
    }

    if (fs.existsSync("./uploads/product/" + productImage.thumbnail)) {
      fs.unlinkSync("./uploads/product/" + productImage.thumbnail);
    }

    const deletedProduct = await ProductModel.deleteOne({ _id: id });
    if (deletedProduct.acknowledged) {
      return res.status(200).json({
        message: "Deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const uploadData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]);
    uploadData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const product_id = req.params.product_id;

      const {
        name,
        category,
        subCategory,
        quantity,
        price,
        shortDescription,
        description,
        status,
      } = req.body;

      const productData = await ProductModel.findOne({
        _id: product_id,
      });

      let thumbnail = productData.thumbnail;
      let image = [];
      console.log(thumbnail);

      if (req.files && req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
        if (fs.existsSync("./uploads/product/" + productData.thumbnail)) {
          fs.unlinkSync("./uploads/product/" + productData.thumbnail);
        }
      }

      if (req.files && req.files["images"]) {
        req.files["images"].forEach((file) => {
          image.push(file.filename);
          for (let i = 0; i < image.length; i++) {
            if (fs.existsSync("./uploads/product/" + image[i])) {
              fs.unlinkSync("./uploads/product/" + image[i]);
            }
          }
        });
      }

      const updatedProduct = await ProductModel.updateOne(
        { _id: product_id },
        {
          $set: {
            name: name,
            category: category,
            subCategory: subCategory,
            quantity: quantity,
            price: price,
            shortDescription: shortDescription,
            description: description,
            thumbnail: thumbnail,
            images: image.join(","),
            status: status,
          },
        }
      );
      if (updatedProduct.acknowledged) {
        return res.status(200).json({
          message: "Updated",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
