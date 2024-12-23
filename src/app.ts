import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import index from "@/routes/index.route";
import stations from "@/routes/stations/stations.index";
import stops from "@/routes/stops/stops.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  stops,
  stations,
  index,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
