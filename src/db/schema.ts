// Keep the schema entrypoint present so models can define tables and run
// `npx drizzle-kit push` without bootstrapping Drizzle config first.
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  ip_address: text("ip_address").notNull(),
  user_agent: text("user_agent"),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
});