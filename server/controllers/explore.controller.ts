import type { Context } from "hono";
import { z } from "zod";
import { explore as exploreService, listCollections } from "../service/explore";

const exploreParamSchema = z.object({
  collection: z.string(),
  genres: z.string().default(""),
  minRating: z.coerce.number().min(0).max(10).default(0),
  fromYear: z.coerce.number().int().min(1900).max(2100).optional(),
  toYear: z.coerce.number().int().min(1900).max(2100).optional(),
  providerId: z.coerce.number().int().positive().optional(),
  streamOnly: z.enum(["0", "1"]).default("0"),
  order: z.enum(["popular", "rated", "recent"]).default("popular"),
  page: z.coerce.number().int().min(1).default(1),
});

const parseGenres = (raw: string): number[] => {
  const ids = raw
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);

  return [...new Set(ids)];
};

export const getExplore = async (c: Context) => {
  const result = exploreParamSchema.safeParse(c.req.query());

  if (!result.success) {
    return c.json({ error: "Invalid parameters", details: result.error.issues }, 400);
  }

  const { collection, genres, minRating, fromYear, toYear, providerId, streamOnly, order, page } =
    result.data;

  const data = await exploreService(
    collection,
    {
      genres: parseGenres(genres),
      minRating: minRating > 0 ? minRating : null,
      fromYear: fromYear ?? null,
      toYear: toYear ?? null,
      providerId: providerId ?? null,
      streamOnly: streamOnly === "1",
      order,
    },
    page,
  );

  if (!data) {
    return c.json(
      {
        error: "Invalid parameters",
        details: [{ path: ["collection"], message: `Unknown collection: ${collection}` }],
      },
      400,
    );
  }

  return c.json(data);
};

export const getCollections = (c: Context) => {
  return c.json({ collections: listCollections() });
};
