import z from "zod";

export const PRODUCT_IMAGE_PREFIX = "products/";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5mb

export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
] as const;

export const imageUploadSchema = z.object({
    fileName: z.string().min(1, {message: "Le nom de l'image est requis"}).max(200),
    contentType: z.enum(ALLOWED_IMAGE_TYPES, {message: "Type d'image non autorisé"}),
    size: z.coerce.number().positive().max(MAX_IMAGE_SIZE, {message: "L'image ne doit pas dépasser 5 Mo"}),
    isImage: z.literal(true),
})
