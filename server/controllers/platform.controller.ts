import type { Context } from "hono";
import { z } from "zod";
import { getPlatformContent } from "../service/platform";

const platformParamSchema = z.object({
  providerId: z.coerce.number().int().positive(),
});

const platformQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

export const getPlatform = async (c: Context) => {
  const params = platformParamSchema.safeParse(c.req.param());
  const query = platformQuerySchema.safeParse(c.req.query());

  if (!params.success || !query.success) {
    return c.json({ error: "Invalid parameters" }, 400);
  }

  const data = await getPlatformContent(params.data.providerId, query.data.page);

  return c.json(data);
};
