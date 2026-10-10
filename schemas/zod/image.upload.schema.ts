import z from "zod";

export const imageUploadSchema = z.object({
    fileName: z.string().min(1, {message: "Imge Nae is required"}),
    contentType: z.string().min(1, {message: "Content type is required"}),
    size: z.coerce.number().positive(),
    isImage: z.boolean(),
})