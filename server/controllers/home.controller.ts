import { Context } from "hono";
import { buildHome } from "../service/home";

export const getHome = async (c: Context) => {
  const data = await buildHome();
  c.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return c.json(data);
};
