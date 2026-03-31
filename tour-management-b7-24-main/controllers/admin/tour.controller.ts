import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import { generateTourCode } from "../../helpers/generate.helper";
import TourCategory from "../../models/tour-category.model";
import { systemConfig } from "../../config/system";

export const index = async (req: Request, res: Response) => { 
  // SELECT * FROM tours WHERE deleted = false;
  const tours = await Tour.findAll({
    where: {
      deleted: false,
    },
    raw: true
  });

  tours.forEach(item => {
    if(item["images"]) {
      const images = JSON.parse(item["images"]);
      item["image"] = images[0];
    }
    item["price_special"] = (item["price"] * (1 - item["discount"] / 100));
  });

  console.log(tours);
  
  res.render("admin/pages/tours/index", {
    pageTitle: "Danh sách tour",
    tours: tours
  });
};

export const create = async (req: Request, res: Response) => {
  // SELECT * FROM categories WHERE deleted = false AND status = "active";
  const categories = await Category.findAll({
    where: {
      deleted: false,
      status: 'active',
    },
    raw: true
  });

  res.render("admin/pages/tours/create", {
    pageTitle: "Thêm mới tour",
    categories: categories
  });
};

export const createPost = async (req: Request, res: Response) => {
  // Lưu data vào bảng tour
  if(req.body.position == "") {
    const countTour = await Tour.count();
    req.body.position = countTour + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const dataTour = {
    title: req.body.title,
    code: "",
    price: parseInt(req.body.price),
    discount: parseInt(req.body.discount),
    stock: parseInt(req.body.stock),
    timeStart: req.body.timeStart,
    position: req.body.position,
    status: req.body.status,
    images: JSON.stringify(req.body.images),
    information: req.body.information,
    schedule: req.body.schedule,
  };

  const tour = await Tour.create(dataTour);
  const tourId = tour.dataValues.id;

  const code = generateTourCode(tourId);

  await Tour.update({
    code: code
  }, {
    where: {
      id: tourId
    }
  });

  // Lưu data vào bảng tours_categories
  const dataTourCategory = {
    tour_id: tourId,
    category_id: parseInt(req.body.category_id)
  };

  await TourCategory.create(dataTourCategory);

  res.redirect(`/${systemConfig.prefixAdmin}/tours`);
};