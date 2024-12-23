import { createRouter } from "../../lib/create-app";
import * as handlers from "./stops.handlers";
import * as routes from "./stops.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list);

export default router;
