import { pgTable, text, timestamp, varchar, index, primaryKey } from "drizzle-orm/pg-core";
import type { ImageStatus } from "@/data/imageData";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    name: varchar("name", { length: 255 }),
    image: text("image"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull().unique(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  })
);

export const accounts = pgTable(
  "accounts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("accounts_user_id_idx").on(table.userId),
    accountIdx: index("accounts_account_idx").on(table.accountId, table.providerId),
  })
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    identifierIdx: index("verification_tokens_identifier_idx").on(table.identifier),
  })
);

export const userImageStatuses = pgTable(
  "user_image_statuses",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    imageId: varchar("image_id", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().$type<ImageStatus>(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.imageId] }),
    userIdIdx: index("user_image_statuses_user_id_idx").on(table.userId),
  })
);

export const userImageNotes = pgTable(
  "user_image_notes",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    imageId: varchar("image_id", { length: 255 }).notNull(),
    notes: text("notes").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.imageId] }),
    userIdIdx: index("user_image_notes_user_id_idx").on(table.userId),
  })
);

export const userDigiAssignments = pgTable(
  "user_digi_assignments",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    digiFileId: varchar("digi_file_id", { length: 255 }).notNull(),
    chapterId: varchar("chapter_id", { length: 255 }).notNull(),
    assignedAt: timestamp("assigned_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.digiFileId] }),
    userIdIdx: index("user_digi_assignments_user_id_idx").on(table.userId),
    chapterIdx: index("user_digi_assignments_chapter_id_idx").on(table.chapterId),
  })
);

export const userUiPreferences = pgTable(
  "user_ui_preferences",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    preferenceKey: varchar("preference_key", { length: 255 }).notNull(),
    preferenceValue: text("preference_value").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.preferenceKey] }),
    userIdIdx: index("user_ui_preferences_user_id_idx").on(table.userId),
  })
);
