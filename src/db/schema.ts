import { relations } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const stations = sqliteTable(
  "stations",
  {
    id: int().primaryKey(),
    name: text().notNull().unique(),
    slug: text().notNull().unique(),
  },
  t => [primaryKey({ columns: [t.id] })],
);

export const selectStationsSchema = createSelectSchema(stations);

export const lines = sqliteTable(
  "lines",
  {
    id: int().primaryKey(),
    name: text().notNull(),
    shortName: text().notNull(),
    key: text().notNull(),
  },
  t => [primaryKey({ columns: [t.id] })],
);

export const stationLines = sqliteTable(
  "station_lines",
  {
    stationId: int()
      .notNull()
      .references(() => stations.id),
    lineId: int()
      .notNull()
      .references(() => lines.id),
    stationLineIndex: int().notNull(),
  },
  t => [primaryKey({ columns: [t.stationId, t.lineId] })],
);

export const stops = sqliteTable(
  "stops",
  {
    id: int().primaryKey(),
    trainNo: text().notNull(),
    departureTime: text(),
    departureStationId: int()
      .notNull()
      .references(() => stations.id),
    arrivalTime: text(),
    arrivalStationId: int()
      .notNull()
      .references(() => stations.id),
    lineId: int()
      .notNull()
      .references(() => lines.id),
  },
  t => [
    primaryKey({ columns: [t.id] }),
    uniqueIndex("idx_stops_combined").on(
      t.arrivalStationId,
      t.departureStationId,
      t.arrivalTime,
      t.departureTime,
      t.lineId,
      t.trainNo,
    ),
  ],
);

export const selectStopsSchema = createSelectSchema(stops);

export const stationsRelations = relations(stations, ({ many }) => ({
  stationsLines: many(stationLines),
  departingStops: many(stops, {
    relationName: "departingStops",
  }),
  arrivingStops: many(stops, {
    relationName: "arrivingStops",
  }),
}));

export const stationLinesRelations = relations(stationLines, ({ one }) => ({
  station: one(stations, {
    fields: [stationLines.stationId],
    references: [stations.id],
  }),
  line: one(lines, {
    fields: [stationLines.lineId],
    references: [lines.id],
  }),
}));

export const linesRelations = relations(lines, ({ many }) => ({
  stationsLines: many(stationLines),
}));

export const stopsRelations = relations(stops, ({ one }) => ({
  departureStation: one(stations, {
    fields: [stops.departureStationId],
    references: [stations.id],
    relationName: "departingStops",
  }),
  arrivalStation: one(stations, {
    fields: [stops.arrivalStationId],
    references: [stations.id],
    relationName: "arrivingStops",
  }),
  line: one(lines, {
    fields: [stops.lineId],
    references: [lines.id],
    relationName: "stopLine",
  }),
}));
