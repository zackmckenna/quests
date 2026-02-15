// Quests Database Schema
// Database: quests (Turso)

import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

// ============================================================
// QUESTS
// ============================================================
// An adventure/hunt that players can discover and play

export const quests = sqliteTable(
  "quests",
  {
    id: text("id").primaryKey(),
    creatorId: text("creator_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    coverImageUrl: text("cover_image_url"),
    // draft = creator is still editing
    // published = visible to players
    // archived = no longer playable
    status: text("status", { enum: ["draft", "published", "archived"] })
      .default("draft")
      .notNull(),
    isPublic: integer("is_public", { mode: "boolean" }).default(false),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("idx_quests_creator").on(table.creatorId),
    index("idx_quests_status").on(table.status),
  ]
);

// ============================================================
// STEPS
// ============================================================
// Ordered sequence of activities within a quest

export const steps = sqliteTable(
  "steps",
  {
    id: text("id").primaryKey(),
    questId: text("quest_id")
      .notNull()
      .references(() => quests.id, { onDelete: "cascade" }),
    orderNum: integer("order_num").notNull(),
    // Step types:
    // - story: narrative content to read
    // - clue: riddle or puzzle to solve
    // - location: go to a specific place
    // - photo: take a photo of something
    // - interact: talk to someone or do an action
    type: text("type", {
      enum: ["story", "clue", "location", "photo", "interact"],
    }).notNull(),
    title: text("title"),
    // Main content (markdown supported)
    content: text("content"),
    // Optional hint for when players are stuck
    hint: text("hint"),
    // Location-based steps
    locationLat: real("location_lat"),
    locationLng: real("location_lng"),
    locationRadius: integer("location_radius"), // meters
    // Verification requirements
    // - none: just tap to continue
    // - location: must be at GPS coordinates
    // - photo: must upload a photo
    // - code: must enter a secret code
    verificationType: text("verification_type", {
      enum: ["none", "location", "photo", "code"],
    }).default("none"),
    // For photo verification: prompt for AI to check
    verificationPrompt: text("verification_prompt"),
    // For code verification: the secret code
    verificationCode: text("verification_code"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("idx_steps_quest").on(table.questId),
    index("idx_steps_order").on(table.questId, table.orderNum),
  ]
);

// ============================================================
// PROGRESS
// ============================================================
// Tracks a player's journey through a quest

export const progress = sqliteTable(
  "progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    questId: text("quest_id")
      .notNull()
      .references(() => quests.id),
    currentStepId: text("current_step_id").references(() => steps.id),
    // active = currently playing
    // completed = finished all steps
    // abandoned = gave up
    status: text("status", {
      enum: ["active", "completed", "abandoned"],
    })
      .default("active")
      .notNull(),
    startedAt: text("started_at").notNull(),
    completedAt: text("completed_at"),
  },
  (table) => [
    index("idx_progress_user").on(table.userId),
    index("idx_progress_quest").on(table.questId),
    index("idx_progress_user_quest").on(table.userId, table.questId),
  ]
);

// ============================================================
// COMPLETIONS
// ============================================================
// Audit trail of completed steps with verification data

export const completions = sqliteTable(
  "completions",
  {
    id: text("id").primaryKey(),
    progressId: text("progress_id")
      .notNull()
      .references(() => progress.id, { onDelete: "cascade" }),
    stepId: text("step_id")
      .notNull()
      .references(() => steps.id),
    verifiedAt: text("verified_at").notNull(),
    // JSON: { photoUrl?, location?, code? }
    verificationData: text("verification_data"),
    // AI response for photo verification
    aiResponse: text("ai_response"),
  },
  (table) => [
    index("idx_completions_progress").on(table.progressId),
    index("idx_completions_step").on(table.stepId),
  ]
);

// ============================================================
// TYPE EXPORTS
// ============================================================

export type Quest = typeof quests.$inferSelect;
export type NewQuest = typeof quests.$inferInsert;

export type Step = typeof steps.$inferSelect;
export type NewStep = typeof steps.$inferInsert;

export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;

export type Completion = typeof completions.$inferSelect;
export type NewCompletion = typeof completions.$inferInsert;
