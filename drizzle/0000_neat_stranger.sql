CREATE TABLE "accounts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"expires_at" timestamp,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"token" varchar(255) NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_digi_assignments" (
	"user_id" varchar(36) NOT NULL,
	"digi_file_id" varchar(255) NOT NULL,
	"chapter_id" varchar(255) NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_digi_assignments_user_id_digi_file_id_pk" PRIMARY KEY("user_id","digi_file_id")
);
--> statement-breakpoint
CREATE TABLE "user_image_notes" (
	"user_id" varchar(36) NOT NULL,
	"image_id" varchar(255) NOT NULL,
	"notes" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_image_notes_user_id_image_id_pk" PRIMARY KEY("user_id","image_id")
);
--> statement-breakpoint
CREATE TABLE "user_image_statuses" (
	"user_id" varchar(36) NOT NULL,
	"image_id" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_image_statuses_user_id_image_id_pk" PRIMARY KEY("user_id","image_id")
);
--> statement-breakpoint
CREATE TABLE "user_ui_preferences" (
	"user_id" varchar(36) NOT NULL,
	"preference_key" varchar(255) NOT NULL,
	"preference_value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_ui_preferences_user_id_preference_key_pk" PRIMARY KEY("user_id","preference_key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"name" varchar(255),
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_digi_assignments" ADD CONSTRAINT "user_digi_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_image_notes" ADD CONSTRAINT "user_image_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_image_statuses" ADD CONSTRAINT "user_image_statuses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ui_preferences" ADD CONSTRAINT "user_ui_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "accounts_account_idx" ON "accounts" USING btree ("account_id","provider_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_digi_assignments_user_id_idx" ON "user_digi_assignments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_digi_assignments_chapter_id_idx" ON "user_digi_assignments" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "user_image_notes_user_id_idx" ON "user_image_notes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_image_statuses_user_id_idx" ON "user_image_statuses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_ui_preferences_user_id_idx" ON "user_ui_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_tokens_identifier_idx" ON "verification_tokens" USING btree ("identifier");