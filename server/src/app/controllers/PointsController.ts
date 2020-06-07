import { Request, Response } from "express";
import knex from "../../database/connection";
import { baseUrl } from "../core/constants";
class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));
    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");
    return response.json(points);
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;
    let point = await knex("points").where("id", id).first();
    if (!point) {
      return response.status(400).json({ message: "Point not found." });
    }
    const serializedPoint = {
      ...point,
      image_url: `${baseUrl}/uploads/${point.image}`,
    };
    let items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.status(200).json({ point: serializedPoint, items });
  }

  async store(request: Request, response: Response) {
    const {
      city,
      email,
      latitude,
      longitude,
      name,
      uf,
      whatsapp,
      items,
    } = request.body;
    const trx = await knex.transaction();
    const data = {
      city,
      email,
      image: request.file.filename,
      latitude,
      longitude,
      name,
      uf,
      whatsapp,
    };
    const insertIds = await trx("points").insert(data);

    const point_id = insertIds[0];
    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: Number) => {
        return {
          item_id,
          point_id,
        };
      });
    await trx("point_items").insert(pointItems);
    trx.commit();

    return response
      .status(201)
      .json({ ...data, id: point_id, message: "success" });
  }
}

export default PointsController;
