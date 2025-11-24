import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const feeds = pgTable("feeds", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    userId: integer("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});