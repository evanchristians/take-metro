import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";

import type { ListRoute } from "./stations.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const stations = await db.query.stations.findMany();

  return c.json(stations);
};
