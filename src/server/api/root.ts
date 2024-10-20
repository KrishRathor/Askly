import { createTRPCRouter } from "./trpc";
import { interactionRouter } from "./routers/interaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  interaction: interactionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
