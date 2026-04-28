import type { Context } from "hono";
import { z } from "zod";
import { search as searchService } from "../service/search";

const searchParamSchema = z.object({
  query: z.string(),
  page: z.coerce.number().default(1),
});

export const getSearch = async (c: Context) => {
  const result = searchParamSchema.safeParse(c.req.query());

  if (!result.success) {
    return c.json({ error: "Invalid parameters", details: result.error.issues }, 400);
  }

  const { query, page } = result.data;
  const data = await searchService(query, page);

  return c.json(data);
};
