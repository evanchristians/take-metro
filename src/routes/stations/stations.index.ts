import { createRouter } from "../../lib/create-app";
import * as handlers from "./stations.handlers";
import * as routes from "./stations.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list);

export default router;
