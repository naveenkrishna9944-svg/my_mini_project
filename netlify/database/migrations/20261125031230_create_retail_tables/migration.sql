CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"category" varchar(60) DEFAULT '' NOT NULL,
	"price" numeric(12,2) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"reorder_level" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_positive_price" CHECK ("price" >= 0.01),
	CONSTRAINT "products_nonnegative_stock" CHECK ("quantity" >= 0 and "reorder_level" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"invoice_no" varchar(40) NOT NULL UNIQUE,
	"customer_name" varchar(100) NOT NULL,
	"product_id" uuid NOT NULL,
	"product_name" varchar(100) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12,2) NOT NULL,
	"total" numeric(22,2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sales_positive_quantity" CHECK ("quantity" > 0)
);
--> statement-breakpoint
CREATE INDEX "sales_created_at_idx" ON "sales" ("created_at");