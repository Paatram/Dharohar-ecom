import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  material: text("material").notNull(),
  finish: text("finish").notNull(),
  currency: text("currency").notNull().default("INR"),
  indicativePricePaise: integer("indicative_price_paise").notNull(),
  exactImageUrlsJson: text("exact_image_urls_json"),
  compositionText: text("composition_text"),
  dimensionsText: text("dimensions_text"),
  careText: text("care_text"),
  compatibilityText: text("compatibility_text"),
  returnPolicyText: text("return_policy_text"),
  dispatchSlaText: text("dispatch_sla_text"),
  hsnCode: text("hsn_code"),
  gstBasisPoints: integer("gst_basis_points"),
  priceIncludesTax: integer("price_includes_tax", { mode: "boolean" }).notNull().default(true),
  packedWeightGrams: integer("packed_weight_grams"),
  packageLengthMm: integer("package_length_mm"),
  packageWidthMm: integer("package_width_mm"),
  packageHeightMm: integer("package_height_mm"),
  returnWindowDays: integer("return_window_days"),
  dispatchMinDays: integer("dispatch_min_days"),
  dispatchMaxDays: integer("dispatch_max_days"),
  inventoryOnHand: integer("inventory_on_hand").notNull().default(0),
  inventoryReserved: integer("inventory_reserved").notNull().default(0),
  exactImagesVerified: integer("exact_images_verified", { mode: "boolean" }).notNull().default(false),
  compositionVerified: integer("composition_verified", { mode: "boolean" }).notNull().default(false),
  dimensionsVerified: integer("dimensions_verified", { mode: "boolean" }).notNull().default(false),
  packedWeightVerified: integer("packed_weight_verified", { mode: "boolean" }).notNull().default(false),
  taxVerified: integer("tax_verified", { mode: "boolean" }).notNull().default(false),
  careVerified: integer("care_verified", { mode: "boolean" }).notNull().default(false),
  compatibilityVerified: integer("compatibility_verified", { mode: "boolean" }).notNull().default(false),
  returnPolicyVerified: integer("return_policy_verified", { mode: "boolean" }).notNull().default(false),
  dispatchSlaVerified: integer("dispatch_sla_verified", { mode: "boolean" }).notNull().default(false),
  commerceStatus: text("commerce_status").notNull().default("verification_required"),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_products_category_status").on(table.category, table.commerceStatus)]);

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  authUserId: text("auth_user_id").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  marketingConsent: integer("marketing_consent", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [uniqueIndex("uidx_customers_auth_user_id").on(table.authUserId), uniqueIndex("uidx_customers_email").on(table.email)]);

export const addresses = sqliteTable("addresses", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Home"),
  recipientName: text("recipient_name").notNull(),
  phone: text("phone").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  gstin: text("gstin"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_addresses_customer_id").on(table.customerId)]);

export const carts = sqliteTable("carts", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
  email: text("email"),
  status: text("status").notNull().default("open"),
  currency: text("currency").notNull().default("INR"),
  giftWrap: integer("gift_wrap", { mode: "boolean" }).notNull().default(false),
  giftMessage: text("gift_message"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_carts_customer_status").on(table.customerId, table.status)]);

export const cartItems = sqliteTable("cart_items", {
  cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull().references(() => products.slug),
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [primaryKey({ columns: [table.cartId, table.productSlug] })]);

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  status: text("status").notNull().default("pending_payment"),
  paymentStatus: text("payment_status").notNull().default("not_started"),
  fulfillmentStatus: text("fulfillment_status").notNull().default("not_fulfilled"),
  currency: text("currency").notNull().default("INR"),
  subtotalPaise: integer("subtotal_paise").notNull(),
  discountPaise: integer("discount_paise").notNull().default(0),
  taxPaise: integer("tax_paise").notNull(),
  shippingPaise: integer("shipping_paise").notNull(),
  totalPaise: integer("total_paise").notNull(),
  addressJson: text("address_json").notNull(),
  giftJson: text("gift_json"),
  shippingJson: text("shipping_json").notNull(),
  idempotencyKey: text("idempotency_key").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [uniqueIndex("uidx_orders_order_number").on(table.orderNumber), uniqueIndex("uidx_orders_idempotency_key").on(table.idempotencyKey), index("idx_orders_customer_created").on(table.customerId, table.createdAt), index("idx_orders_status_created").on(table.status, table.createdAt)]);

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull().references(() => products.slug),
  productName: text("product_name").notNull(),
  unitPricePaise: integer("unit_price_paise").notNull(),
  taxPaise: integer("tax_paise").notNull(),
  quantity: integer("quantity").notNull(),
}, (table) => [index("idx_order_items_order_id").on(table.orderId), index("idx_order_items_product_slug").on(table.productSlug)]);

export const orderEvents = sqliteTable("order_events", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  publicMessage: text("public_message"),
  metadataJson: text("metadata_json"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_order_events_order_created").on(table.orderId, table.createdAt)]);

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  provider: text("provider").notNull(),
  providerOrderId: text("provider_order_id"),
  providerPaymentId: text("provider_payment_id"),
  status: text("status").notNull(),
  amountPaise: integer("amount_paise").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [uniqueIndex("uidx_payments_provider_order").on(table.provider, table.providerOrderId), index("idx_payments_order_id").on(table.orderId)]);

export const shipments = sqliteTable("shipments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  provider: text("provider").notNull(),
  providerOrderId: text("provider_order_id"),
  providerShipmentId: text("provider_shipment_id"),
  awb: text("awb"),
  courier: text("courier"),
  status: text("status").notNull(),
  trackingUrl: text("tracking_url"),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_shipments_order_id").on(table.orderId), uniqueIndex("uidx_shipments_awb").on(table.awb)]);

export const returns = sqliteTable("returns", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  customerId: text("customer_id").references(() => customers.id),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("requested"),
  resolution: text("resolution"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_returns_order_id").on(table.orderId), index("idx_returns_status").on(table.status)]);

export const careSubscriptions = sqliteTable("care_subscriptions", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  plan: text("plan").notNull(),
  status: text("status").notNull().default("interest_registered"),
  reminderConsent: integer("reminder_consent", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_care_subscriptions_customer").on(table.customerId), index("idx_care_subscriptions_status").on(table.status)]);

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull(),
  kind: text("kind").notNull(),
  customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  payloadJson: text("payload_json").notNull(),
  status: text("status").notNull().default("received"),
  consentAt: integer("consent_at").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [uniqueIndex("uidx_enquiries_reference").on(table.reference), index("idx_enquiries_status_created").on(table.status, table.createdAt)]);

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id),
  customerId: text("customer_id").notNull().references(() => customers.id),
  productSlug: text("product_slug").notNull().references(() => products.slug),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("pending_moderation"),
  createdAt: integer("created_at").notNull(),
}, (table) => [uniqueIndex("uidx_reviews_order_item").on(table.orderItemId), index("idx_reviews_product_status").on(table.productSlug, table.status)]);

export const inventoryMovements = sqliteTable("inventory_movements", {
  id: text("id").primaryKey(),
  productSlug: text("product_slug").notNull().references(() => products.slug),
  orderId: text("order_id").references(() => orders.id),
  movementType: text("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  reason: text("reason").notNull(),
  actorId: text("actor_id"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_inventory_movements_product_created").on(table.productSlug, table.createdAt)]);

export const inventoryReservations = sqliteTable("inventory_reservations", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull().references(() => products.slug),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default("active"),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  uniqueIndex("uidx_inventory_reservations_order_product").on(table.orderId, table.productSlug),
  index("idx_inventory_reservations_status_expiry").on(table.status, table.expiresAt),
]);

export const webhookEvents = sqliteTable("webhook_events", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  providerEventId: text("provider_event_id").notNull(),
  eventType: text("event_type").notNull(),
  payloadHash: text("payload_hash").notNull(),
  status: text("status").notNull().default("received"),
  processedAt: integer("processed_at"),
  createdAt: integer("created_at").notNull(),
}, (table) => [uniqueIndex("uidx_webhook_events_provider_event").on(table.provider, table.providerEventId)]);

export const idempotencyKeys = sqliteTable("idempotency_keys", {
  key: text("key").primaryKey(),
  scope: text("scope").notNull(),
  requestHash: text("request_hash").notNull(),
  responseStatus: integer("response_status"),
  responseJson: text("response_json"),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_idempotency_keys_expires_at").on(table.expiresAt)]);

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(1),
  expiresAt: integer("expires_at").notNull(),
}, (table) => [index("idx_rate_limits_expires_at").on(table.expiresAt)]);

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  invoiceNumber: text("invoice_number").notNull(),
  status: text("status").notNull().default("pending"),
  documentKey: text("document_key"),
  createdAt: integer("created_at").notNull(),
}, (table) => [uniqueIndex("uidx_invoices_invoice_number").on(table.invoiceNumber), uniqueIndex("uidx_invoices_order_id").on(table.orderId)]);

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: text("subject_id").notNull(),
  metadataJson: text("metadata_json"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_audit_events_subject_created").on(table.subjectType, table.subjectId, table.createdAt)]);

export const notificationOutbox = sqliteTable("notification_outbox", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id),
  channel: text("channel").notNull(),
  template: text("template").notNull(),
  destination: text("destination").notNull(),
  payloadJson: text("payload_json").notNull(),
  status: text("status").notNull().default("blocked_unconfigured"),
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: integer("next_attempt_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_notification_outbox_status_next").on(table.status, table.nextAttemptAt)]);

export const savedProducts = sqliteTable("saved_products", {
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull().references(() => products.slug, { onDelete: "cascade" }),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  primaryKey({ columns: [table.customerId, table.productSlug] }),
  index("idx_saved_products_customer_created").on(table.customerId, table.createdAt),
]);

export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
  sessionId: text("session_id"),
  eventName: text("event_name").notNull(),
  pagePath: text("page_path"),
  propertiesJson: text("properties_json"),
  consented: integer("consented", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_analytics_events_name_created").on(table.eventName, table.createdAt),
  index("idx_analytics_events_customer_created").on(table.customerId, table.createdAt),
]);
