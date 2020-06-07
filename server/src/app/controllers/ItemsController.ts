import { Request, Response } from "express";
import knex from "../../database/connection";
import { baseUrl } from "../core/constants";
import IItem from "../interfaces/IItem";
class ItemsController {
  async index(request: Request, response: Response) {
    let items: IItem[] = await knex("items").select("*");
    let serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `${baseUrl}/uploads/${item.image}`,
      };
    });
    response.json(serializedItems);
  }
}

export default ItemsController;
