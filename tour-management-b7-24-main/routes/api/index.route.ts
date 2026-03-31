// ===================================================
// API Routes - Trả về JSON cho React Frontend
// File MỚI - Không sửa bất kỳ file backend cũ nào
// ===================================================

import { Router, Request, Response } from "express";
import Category from "../../models/category.model";
import Tour from "../../models/tour.model";
import TourCategory from "../../models/tour-category.model";
import Order from "../../models/order.model";
import OrderItem from "../../models/order-item.model";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";
import { generateTourCode, generateOrderCode } from "../../helpers/generate.helper";
import multer from "multer";
import { uploadFields, uploadSingle } from "../../middlewares/admin/uploadCloud.middleware";

const router: Router = Router();
const upload = multer();

// ========================
// CLIENT APIs
// ========================

// GET /api/categories - Danh sách danh mục (active)
// Tương ứng: controllers/client/category.controller.ts → index()
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      where: {
        deleted: false,
        status: "active"
      },
      raw: true
    });

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /api/tours/:slugCategory - Tours theo danh mục
// Tương ứng: controllers/client/tour.controller.ts → index()
router.get("/tours/detail/:slugTour", async (req: Request, res: Response) => {
  // ĐẶT ROUTE NÀY TRƯỚC /tours/:slugCategory để tránh conflict
  try {
    const slugTour = req.params.slugTour;

    const tourDetail = await Tour.findOne({
      where: {
        slug: slugTour,
        deleted: false,
        status: "active"
      },
      raw: true
    });

    if (!tourDetail) {
      res.status(404).json({ error: "Tour không tồn tại" });
    } else {
      if (tourDetail["images"]) {
        tourDetail["images"] = JSON.parse(tourDetail["images"]);
      }

      tourDetail["price_special"] = (1 - tourDetail["discount"] / 100) * tourDetail["price"];

      res.json({ tourDetail });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /api/tours/:slugCategory - Tours theo danh mục
router.get("/tours/:slugCategory", async (req: Request, res: Response) => {
  try {
    const slugCategory = req.params.slugCategory;

    const tours = await sequelize.query(`
      SELECT tours.*, price * (1 - discount/100) AS price_special
      FROM tours
      JOIN tours_categories ON tours.id = tours_categories.tour_id
      JOIN categories ON tours_categories.category_id = categories.id
      WHERE
        categories.slug = :slugCategory
        AND categories.deleted = false
        AND categories.status = 'active'
        AND tours.deleted = false
        AND tours.status = 'active';
    `, {
      type: QueryTypes.SELECT,
      replacements: { slugCategory }
    });

    for (const item of tours) {
      if (item["images"]) {
        item["images"] = JSON.parse(item["images"]);
        item["image"] = item["images"][0];
        item["price_special"] = parseInt(item["price_special"]);
      }
    }

    res.json({ tours });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// POST /api/cart/list - Danh sách giỏ hàng (đã có sẵn logic trả JSON)
// Tương ứng: controllers/client/cart.controller.ts → list()
router.post("/cart/list", async (req: Request, res: Response) => {
  try {
    const tours = req.body;
    let total = 0;

    for (const tour of tours) {
      const infoTour = await Tour.findOne({
        where: { id: tour.tourId },
        raw: true
      });

      if (infoTour["images"]) {
        infoTour["images"] = JSON.parse(infoTour["images"]);
        tour["image"] = infoTour["images"][0];
      }

      tour["title"] = infoTour["title"];
      tour["slug"] = infoTour["slug"];
      tour["price_special"] = (1 - infoTour["discount"] / 100) * infoTour["price"];
      tour["total"] = tour["price_special"] * tour["quantity"];
      total += tour["total"];
    }

    res.json({ tours, total });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// POST /api/order - Đặt tour
// Tương ứng: controllers/client/order.controller.ts → index()
router.post("/order", async (req: Request, res: Response) => {
  try {
    const info = req.body.info;
    const cart = req.body.cart;

    const dataOrder = {
      code: "",
      fullName: info.fullName,
      phone: info.phone,
      note: info.note,
      status: "initial",
    };

    const order = await Order.create(dataOrder);
    const orderId = order.dataValues.id;

    const code = generateOrderCode(orderId);

    await Order.update({ code }, {
      where: { id: orderId }
    });

    for (const item of cart) {
      const dataItem = {
        orderId: orderId,
        tourId: item.tourId,
        quantity: item.quantity,
      };

      const tourInfo = await Tour.findOne({
        where: {
          id: item.tourId,
          deleted: false,
          status: "active"
        },
        raw: true
      });

      dataItem["price"] = tourInfo["price"];
      dataItem["discount"] = tourInfo["discount"];
      dataItem["timeStart"] = tourInfo["timeStart"];

      await OrderItem.create(dataItem);
    }

    res.json({
      code: "success",
      message: "Đặt hàng thành công!",
      orderCode: code
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /api/order/success?orderCode=xxx - Thông tin đơn hàng thành công
// Tương ứng: controllers/client/order.controller.ts → success()
router.get("/order/success", async (req: Request, res: Response) => {
  try {
    const orderCode = req.query.orderCode;

    const order = await Order.findOne({
      where: {
        code: orderCode,
        deleted: false,
      },
      raw: true,
    });

    if (!order) {
      res.status(404).json({ error: "Đơn hàng không tồn tại" });
    } else {

    const ordersItem = await OrderItem.findAll({
      where: { orderId: order["id"] },
      raw: true,
    });

    for (const item of ordersItem) {
      item["price_special"] = (item["price"] * (1 - item["discount"] / 100));
      item["total"] = item["price_special"] * item["quantity"];

      const tourInfo = await Tour.findOne({
        where: { id: item["tourId"] },
        raw: true,
      });

      tourInfo["images"] = JSON.parse(tourInfo["images"]);
      item["image"] = tourInfo["images"][0];
      item["title"] = tourInfo["title"];
      item["slug"] = tourInfo["slug"];
    }

    order["total_price"] = ordersItem.reduce((sum, item) => sum + item["total"], 0);

    res.json({ order, ordersItem });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ========================
// ADMIN APIs
// ========================

// GET /api/admin/tours - Admin: danh sách tour
// Tương ứng: controllers/admin/tour.controller.ts → index()
router.get("/admin/tours", async (req: Request, res: Response) => {
  try {
    const tours = await Tour.findAll({
      where: { deleted: false },
      raw: true
    });

    tours.forEach(item => {
      if (item["images"]) {
        const images = JSON.parse(item["images"]);
        item["image"] = images[0];
      }
      item["price_special"] = (item["price"] * (1 - item["discount"] / 100));
    });

    res.json({ tours });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /api/admin/categories - Admin: danh sách danh mục
// Tương ứng: controllers/admin/category.controller.ts → index()
router.get("/admin/categories", async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      where: { deleted: false },
      raw: true
    });

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /api/admin/tours/categories - Admin: danh mục cho form tạo tour
// Tương ứng: controllers/admin/tour.controller.ts → create()
router.get("/admin/tours/categories", async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      where: {
        deleted: false,
        status: 'active',
      },
      raw: true
    });

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// POST /api/admin/tours/create - Admin: tạo tour mới
// Tương ứng: controllers/admin/tour.controller.ts → createPost()
router.post(
  "/admin/tours/create",
  upload.fields([{ name: 'images', maxCount: 10 }]),
  uploadFields,
  async (req: Request, res: Response) => {
    try {
      if (req.body.position == "") {
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
      await Tour.update({ code }, {
        where: { id: tourId }
      });

      const dataTourCategory = {
        tour_id: tourId,
        category_id: parseInt(req.body.category_id)
      };

      await TourCategory.create(dataTourCategory);

      res.json({
        code: "success",
        message: "Tạo tour thành công!"
      });
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  }
);

// POST /api/admin/upload - Admin: upload ảnh (TinyMCE)
router.post(
  "/admin/upload",
  upload.single("file"),
  uploadSingle,
  async (req: Request, res: Response) => {
    res.json({ location: req.body.file });
  }
);

export const apiRoutes: Router = router;
