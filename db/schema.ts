import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
export const notes = sqliteTable("notes", {
 id: text("id").primaryKey(),
 createdAt: text("created_at").notNull(),
 payload: text("payload").notNull(),
 payloadHash: text("payload_hash").notNull(),
}, (t) => [index("notes_created_at_idx").on(t.createdAt)]);
