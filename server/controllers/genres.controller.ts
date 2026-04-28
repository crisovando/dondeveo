import { Context } from "hono";
import { getGenres } from "../service/genres";

export const getAllGenres = async (c: Context) => {
  const data = await getGenres();
  return c.json(data);
};
