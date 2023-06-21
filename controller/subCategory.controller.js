import SubCategoryModel from "../modal/subCategory.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/subCategory")) {
      cb(null, "./uploads/subCategory");
    } else {
      fs.mkdirSync("./uploads/subCategory");
      cb(null, "./uploads/subCategory");
    }
  },
  filename: function (req, file, cb) {
    const name = file.originalname; // abc.png
    const ext = path.extname(name); // .png
    const nameArr = name.split("."); // [abc,png]
    nameArr.pop();
    const fname = nameArr.join("."); //abc
    const fullname = fname + "-" + Date.now() + ext; // abc-12345.png
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });

export const getAllSubCategory = async (req, res) => {
  try {
    const SubCategoryData = await SubCategoryModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
    ]);
    if (SubCategoryData) {
      return res.status(200).json({
        data: SubCategoryData,
        message: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSubCategory = async (req, res) => {
  try {
    const id = req.params.subcategory_id;

    const SubcategoryData = await SubCategoryModel.findOne({ _id: id });
    if (SubcategoryData) {
      return res.status(200).json({
        data: SubcategoryData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addSubCategory = (req, res) => {
  try {
    const uploadData = upload.single("image");
    uploadData(req, res, function (error) {
      if (error) return res.status(400).json({ message: error.message });

      const { name, category } = req.body;

      let image = null;
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      const createdRecord = new SubCategoryModel({
        name: name,
        category: category,
        image: image,
      });

      createdRecord.save();

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

export const updateSubCategory = async (req, res) => {
  try {
    const uploadData = upload.single("image");
    uploadData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const subcategory_id = req.params.subcategory_id;

      const { name } = req.body;

      const subCategoryData = await SubCategoryModel.findOne({
        _id: subcategory_id,
      });

      let image = subCategoryData.image;
      console.log(image);

      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/subCategory/" + subCategoryData.image)) {
          fs.unlinkSync("./uploads/subCategory/" + subCategoryData.image);
        }
      }
      const updatedSubCategory = await SubCategoryModel.updateOne(
        { _id: subcategory_id },
        {
          $set: {
            name: name,
            image: image,
          },
        }
      );
      if (updatedSubCategory.acknowledged) {
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

export const deleteSubCategory = async (req, res) => {
  try {
    const id = req.params.subcategory_id;

    const subCategoryImage = await SubCategoryModel.findOne({ _id: id });

    if (fs.existsSync("./uploads/subCategory/" + subCategoryImage.image)) {
      fs.unlinkSync("./uploads/subCategory/" + subCategoryImage.image);
    }

    const deletedSubCategory = await SubCategoryModel.deleteOne({ _id: id });
    if (deletedSubCategory.acknowledged) {
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
