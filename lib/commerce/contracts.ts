import { z } from "zod";

export const cartLineSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1).max(20),
});

export const quoteSchema = z.object({
  items: z.array(cartLineSchema).min(1).max(40),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  coupon: z.string().trim().max(40).optional(),
  giftWrap: z.boolean().default(false),
  giftMessage: z.string().trim().max(240).optional(),
});

export const enquirySchema = z.object({
  kind: z.enum(["retail", "trade"]),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(160),
  payload: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
  consent: z.literal(true),
});

export const careSchema = z.object({
  email: z.string().trim().email().max(254),
  plan: z.enum(["monthly", "quarterly", "seasonal"]),
  material: z.enum(["copper", "peetal", "kansa", "mixed"]),
  reminderConsent: z.boolean(),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1).max(40).default("Home"),
  recipientName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[+]?[0-9\s-]{10,16}$/),
  line1: z.string().trim().min(4).max(160),
  line2: z.string().trim().max(160).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().regex(/^\d{6}$/),
  gstin: z.string().trim().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).optional(),
  isDefault: z.boolean().default(false),
});

export const orderStartSchema = quoteSchema.extend({
  email: z.string().trim().email().max(254),
  address: addressSchema,
});

export const trackingSchema = z.object({
  orderNumber: z.string().trim().regex(/^DH-[A-Z0-9-]{4,24}$/i),
  email: z.string().trim().email().max(254),
});

export const returnSchema = z.object({
  orderNumber: z.string().trim().min(4).max(40),
  reason: z.string().trim().min(10).max(600),
});

export const reviewSchema = z.object({
  orderItemId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(100),
  body: z.string().trim().min(20).max(1200),
});

export const inventoryAdjustmentSchema = z.object({
  productSlug: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(-10000).max(10000).refine((value) => value !== 0),
  reason: z.string().trim().min(5).max(240),
});

export const productVerificationSchema = z.object({
  productSlug: z.string().trim().min(1).max(120),
  exactImageUrls: z.array(z.string().url()).min(3).max(12),
  compositionText: z.string().trim().min(10).max(500),
  dimensionsText: z.string().trim().min(5).max(300),
  careText: z.string().trim().min(20).max(1200),
  compatibilityText: z.string().trim().min(5).max(500),
  returnPolicyText: z.string().trim().min(10).max(800),
  dispatchSlaText: z.string().trim().min(5).max(400),
  hsnCode: z.string().trim().regex(/^\d{4,8}$/),
  gstBasisPoints: z.number().int().min(0).max(5000),
  priceIncludesTax: z.boolean(),
  packedWeightGrams: z.number().int().min(1).max(100_000),
  packageLengthMm: z.number().int().min(1).max(5000),
  packageWidthMm: z.number().int().min(1).max(5000),
  packageHeightMm: z.number().int().min(1).max(5000),
  returnWindowDays: z.number().int().min(0).max(90),
  dispatchMinDays: z.number().int().min(0).max(90),
  dispatchMaxDays: z.number().int().min(0).max(120),
}).refine((value) => value.dispatchMaxDays >= value.dispatchMinDays, { message: "Maximum dispatch days must be at least the minimum." });

export const wishlistSchema = z.object({
  productSlugs: z.array(z.string().trim().min(1).max(120)).max(100),
});

export const shipmentStartSchema = z.object({
  orderNumber: z.string().trim().min(4).max(40),
  weightGrams: z.number().int().min(1).max(200_000),
  lengthMm: z.number().int().min(1).max(5000),
  widthMm: z.number().int().min(1).max(5000),
  heightMm: z.number().int().min(1).max(5000),
});
