import { Context } from "hono";
import { z } from "zod";
import { getPerson as getPersonService } from "../service/person";

const paramSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const getPerson = async (c: Context) => {
  const result = paramSchema.safeParse(c.req.param());

  if (!result.success) {
    return c.json({ error: "Invalid parameters", details: result.error.issues }, 400);
  }

  const data = await getPersonService(result.data.id);
  c.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return c.json(data);
};
