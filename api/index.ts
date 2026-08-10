import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import * as homeController from "../server/controllers/home.controller";
import * as searchController from "../server/controllers/search.controller";
import * as genresController from "../server/controllers/genres.controller";
import * as detailController from "../server/controllers/detail.controller";
import * as providersController from "../server/controllers/providers.controller";
import * as platformController from "../server/controllers/platform.controller";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.use(logger());

app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

app.get("/home", homeController.getHome);
app.get("/search", searchController.getSearch);
app.get("/genres", genresController.getAllGenres);
app.get("/detail/:type/:id", detailController.getDetail);
app.get("/providers/:type/:id", providersController.getProviders);
app.get("/providers/batch", providersController.getProvidersBatch);
app.get("/platform/:providerId", platformController.getPlatform);

export default handle(app);
