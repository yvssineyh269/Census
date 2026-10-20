import { env } from "@/lib/env";
import {
  imageUploadSchema,
  PRODUCT_IMAGE_PREFIX,
} from "@/schemas/zod/image.upload.schema";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { S3 } from "@/lib/S3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSessionWithRole, INVENTORY_ROLES } from "@/lib/authorization";

export async function POST(request: Request) {
  const session = await getSessionWithRole(INVENTORY_ROLES);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = imageUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 },
      );
    }

    const { fileName, contentType, size } = validation.data;
    // On ne garde que des caractères sûrs pour éviter les clés S3 farfelues (../, espaces, etc.)
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueKey = `${PRODUCT_IMAGE_PREFIX}${randomUUID()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });

    const response = {
      presignedUrl,
      key: uniqueKey,
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 },
    );
  }
}
