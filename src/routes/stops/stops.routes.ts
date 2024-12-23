import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { selectStopsSchema } from "../../db/schema";

const tags = ["Stops"];

export const list = createRoute({
  path: "/stops/{from}/{to}",
  method: "get",
  description: "Get the list of stops between two stations",
  tags,
  request: {
    params: z.object({
      from: z.string().openapi({
        example: "cape-town",
        description: "The departing station",
      }),
      to: z.string().openapi({
        example: "muizenberg",
        description: "The arriving station",
      }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectStopsSchema),
      "The list of stops between the two stations",
    ),
  },
});

export type ListRoute = typeof list;
