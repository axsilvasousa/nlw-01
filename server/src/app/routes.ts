import express from "express";
import multer from "multer";
import multerConfig from "./core/multer";
import { celebrate, Joi } from "celebrate";

import ItemsController from "./controllers/ItemsController";
import PointsController from "./controllers/PointsController";

const routes = express.Router();
const upload = multer(multerConfig);

const Items = new ItemsController();
const Points = new PointsController();

routes.get("/", (_request, response) => {
  response.send("Api v0.0.0.1");
});

routes.get("/items", Items.index);

routes.get("/points", Points.index);
routes.get("/points/:id", Points.show);

routes.post(
  "/points",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        uf: Joi.string().required().max(2),
        city: Joi.string().required(),
        whatsapp: Joi.string().required(),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  Points.store
);

export default routes;
