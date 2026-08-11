import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import * as homeController from "../server/controllers/home.controller";
import * as searchController from "../server/controllers/search.controller";
import * as genresController from "../server/controllers/genres.controller";
import * as detailController from "../server/controllers/detail.controller";
import * as providersController from "../server/controllers/providers.controller";
import * as platformController from "../server/controllers/platform.controller";
import * as ssrController from "../server/controllers/ssr.controller";

export const config = {
  runtime: "edge",
};

const api = new Hono();
api.get("/home", homeController.getHome);
api.get("/search", searchController.getSearch);
api.get("/genres", genresController.getAllGenres);
api.get("/detail/:type/:id", detailController.getDetail);
api.get("/providers/:type/:id", providersController.getProviders);
api.get("/providers/batch", providersController.getProvidersBatch);
api.get("/platform/:providerId", platformController.getPlatform);

// One app for both surfaces: /api/* keeps the exact same runtime behavior as
// before, while "/" and "/home" render the SSR'd Home document (wired by the
// vercel.json rewrites).
const app = new Hono();
app.use(logger());

app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

app.get("/", ssrController.getHomeSsr);
app.get("/home", ssrController.getHomeSsr);
app.route("/api", api);

export default handle(app);
