import { Context } from "hono";
import { z } from "zod";
import { getSeasonProviders as getSeasonProvidersService } from "../service/seasons";

const MAX_SEASONS = 50;

const paramSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const seasonListSchema = z.array(z.coerce.number().int().positive()).max(MAX_SEASONS);

export const getSeasonProviders = async (c: Context) => {
  const params = paramSchema.safeParse(c.req.param());

  if (!params.success) {
    return c.json({ error: "Invalid parameters", details: params.error.issues }, 400);
  }

  const rawSeasons = (c.req.query("seasons") ?? "").split(",").filter(Boolean);
  const seasonsResult = seasonListSchema.safeParse(rawSeasons);

  if (!seasonsResult.success) {
    return c.json({ error: "Invalid parameters", details: seasonsResult.error.issues }, 400);
  }

  const seasons = await getSeasonProvidersService(params.data.id, seasonsResult.data);

  c.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return c.json({ id: params.data.id, seasons });
};
