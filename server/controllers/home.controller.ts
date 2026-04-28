import { Context } from "hono";
import { buildHome } from "../service/home";

export const getHome = async (c: Context) => {
  const data = await buildHome();
  return c.json(data);
};
