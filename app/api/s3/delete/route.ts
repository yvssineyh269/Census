import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { prisma } from "@/lib/db";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSessionWithRole, INVENTORY_ROLES } from "@/lib/authorization";
import { PRODUCT_IMAGE_PREFIX } from "@/schemas/zod/image.upload.schema";

export async function DELETE(request: Request) {
  const session = await getSessionWithRole(INVENTORY_ROLES);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const key = body.key;

    if (typeof key !== "string" || !key.startsWith(PRODUCT_IMAGE_PREFIX)) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 },
      );
    }

    // Une image déjà rattachée à un produit ne doit pas être supprimée depuis l'uploader
    const usedByProduct = await prisma.product.findFirst({
      where: { image: key },
      select: { id: true },
    });

    if (usedByProduct) {
      return NextResponse.json(
        { error: "Image is used by a product" },
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
