import { and, eq, or } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { stations, stops } from "@/db/schema";

import type { ListRoute } from "./stops.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { from, to } = c.req.valid("param");
  const [departingStation, arrivingStation] = await db.query.stations.findMany({
    where: or(eq(stations.slug, from), eq(stations.slug, to)),
    limit: 2,
  });
  if (!departingStation || !arrivingStation) {
    throw new Error("Stations not found");
  }
  const schedule = (
    await db.query.stops.findMany({
      where: and(
        eq(stops.departureStationId, departingStation.id),
        eq(stops.arrivalStationId, arrivingStation.id),
      ),
      with: {
        line: true,
        departureStation: true,
        arrivalStation: true,
      },
    })
  );
  return c.json(schedule);
};
