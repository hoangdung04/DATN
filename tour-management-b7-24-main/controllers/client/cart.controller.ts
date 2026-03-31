import { Request, Response } from "express";
import Tour from "../../models/tour.model";

export const index = async (req: Request, res: Response) => {
  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng"
  });
};

export const list = async (req: Request, res: Response) => {
  const tours = req.body;

  let total = 0;

  for (const tour of tours) {
    const infoTour = await Tour.findOne({
      where: {
        id: tour.tourId
      },
      raw: true
    });

    if(infoTour["images"]) {
      infoTour["images"] = JSON.parse(infoTour["images"]);
      tour["image"] = infoTour["images"][0];
    }

    tour["title"] = infoTour["title"];
    tour["slug"] = infoTour["slug"];
    tour["price_special"] = (1 - infoTour["discount"]/100) * infoTour["price"];
    tour["total"] = tour["price_special"] * tour["quantity"];
    total += tour["total"];
  }

  res.json({
    tours: tours,
    total: total
  });
};