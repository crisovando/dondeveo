import { Context } from "hono";
import { z } from "zod";
import { getWatchProviders, getWatchProvidersBatched } from "../service/providers";

const providersParamSchema = z.object({
  type: z.enum(["movie", "tv"]),
  id: z.coerce.number().int().positive(),
});

const MAX_BATCH = 50;

const batchItemSchema = z
  .string()
  .refine((value) => /^(movie|tv):\d+$/.test(value), "Formato inválido");

export const getProviders = async (c: Context) => {
  const result = providersParamSchema.safeParse(c.req.param());

  if (!result.success) {
    return c.json({ error: "Invalid parameters", details: result.error.issues }, 400);
  }

  const { type, id } = result.data;
  const providers = await getWatchProviders(type, id);

  return c.json({ type, id, providers });
};

export const getProvidersBatch = async (c: Context) => {
  const raw = c.req.query("items") ?? "";
  const parts = raw.split(",").filter(Boolean).slice(0, MAX_BATCH);

  const parsed = parts.map((part) => batchItemSchema.safeParse(part));

  if (parsed.some((p) => !p.success)) {
    return c.json({ error: "Invalid parameters" }, 400);
  }

  const items = parsed.map((p) => {
    const [type, id] = p.data!.split(":");
    return { type, id: Number(id) };
  });

  const providers = await getWatchProvidersBatched(items);

  c.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return c.json({ providers });
};