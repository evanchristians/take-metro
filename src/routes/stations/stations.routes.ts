import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { selectStationsSchema } from "../../db/schema";

const tags = ["Stations"];

export const list = createRoute({
  path: "/stations",
  method: "get",
  description: "Get the list of station names and their slugs",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectStationsSchema),
      "The list of stations names and their slugs",
    ),
  },
});

export type ListRoute = typeof list;
