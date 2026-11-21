import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { prisma } from "@/lib/db";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSessionWithRole, IMAGE_FOLDER_ROLES } from "@/lib/authorization";
import {
  EXPENSE_IMAGE_PREFIX,
  PRODUCT_IMAGE_PREFIX,
} from "@/schemas/zod/image.upload.schema";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const key = body.key;

    const folder =
      typeof key !== "string"
        ? null
        : key.startsWith(PRODUCT_IMAGE_PREFIX)
          ? "products"
          : key.startsWith(EXPENSE_IMAGE_PREFIX)
            ? "expenses"
            : null;

    if (!folder) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 },
      );
    }

    // Les rôles autorisés dépendent du dossier (inventaire ou dépenses)
    const session = await getSessionWithRole(IMAGE_FOLDER_ROLES[folder]);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Une image déjà rattachée à un produit ou une dépense ne doit pas être supprimée depuis l'uploader
    const isUsed =
      folder === "products"
        ? await prisma.product.findFirst({ where: { image: key }, select: { id: true } })
        : await prisma.expense.findFirst({ where: { image: key }, select: { id: true } });

    if (isUsed) {
      return NextResponse.json(
        { error: "Image is already in use" },
        { status: 409 },
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
