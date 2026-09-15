import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. جدول المستخدمين (Users)
// ==========================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name"),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 2. التصنيفات الأساسية والفرعية (Categories)
// ==========================================
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 3. جدول المنتجات والصور والإرباط (Products)
// ==========================================
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortDescription: text("short_description"),
  longDescription: text("long_description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // السعر بخانتين عشريتين
  imageUrl: varchar("image_url", { length: 500 }).notNull(), // الصورة الرئيسية
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// الصور الإضافية للمنتج (Multiple Images)
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
});

// جدول الربط بين المنتجات والتصنيفات الفرعية (Many-to-Many)
export const productSubcategories = pgTable(
  "product_subcategories",
  {
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    subcategoryId: integer("subcategory_id")
      .references(() => subcategories.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.subcategoryId] }),
  })
);

// ==========================================
// 4. جدول الطلبات وتفاصيلها (Orders)
// ==========================================
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  // إذا كان زائرًا يترك الحقل null، وإذا كان مسجلاً يرتبط بحسابه
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// عناصر الطلب (المنتجات التي تم شراؤها في هذا الطلب)
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull().default(1),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // حفظ سعر المنتج وقت الشراء
});

// ==========================================
// 5. العلاقات (Relations) لسهولة الاستعلامات
// ==========================================

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(productSubcategories),
}));

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  subcategories: many(productSubcategories),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productSubcategoriesRelations = relations(productSubcategories, ({ one }) => ({
  product: one(products, {
    fields: [productSubcategories.productId],
    references: [products.id],
  }),
  subcategory: one(subcategories, {
    fields: [productSubcategories.subcategoryId],
    references: [subcategories.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));