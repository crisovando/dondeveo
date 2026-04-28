import { Context } from "hono";
import { z } from "zod";
import { getDetail as getDetailService } from "../service/detail";

const paramSchema = z.object({
  type: z.enum(["movie", "tv", "person"]),
  id: z.string().regex(/^\d+$/, "ID must be numeric"),
});

export const getDetail = async (c: Context) => {
  const result = paramSchema.safeParse(c.req.param());

  if (!result.success) {
    return c.json({ error: "Invalid parameters", details: result.error.issues }, 400);
  }

  const { type, id } = result.data;
  const path = `/${type}/${id}`;

  const data = await getDetailService(path, type);
  return c.json(data);
};
