import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.S3_BUCKET || "";
const S3_REGION = process.env.S3_REGION || "";
const ENDPOINT = process.env.S3_ENDPOINT || "";
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const tinifyAvaliableExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const S3 = new S3Client({
  region: S3_REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("image") as Blob | null;
  const imageKey = formData.get("imageKey") as string;

  if (!file || !imageKey) {
    return NextResponse.json(
      { error: "File blob or image key is required." },
      { status: 400 }
    );
  }

  const imageFuffer = Buffer.from(await file.arrayBuffer());

  try {
    const tinifyRes = await (
      await fetch("https://api.tinify.com//shrink", {
        method: "POST",
        body: imageFuffer,
        headers: {
          Authorization: `Basic ${btoa(`api:${process.env.TINIFY_API_KEY}`)}`,
        },
      })
    ).json();

    if(!tinifyRes.output) throw new Error("Tinify failed.");

    const tinifyImgUrl = tinifyRes.output.url;
    const tinifyTmgType = tinifyRes.output.type;

    const tinifyImgBuffer = await fetch(tinifyImgUrl).then((res) =>
      res.arrayBuffer().then((buffer) => Buffer.from(buffer))
    );

    const S3UploadRes = await S3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: tinifyImgBuffer,
        ContentType: tinifyTmgType,
      })
    );

    return NextResponse.json({
      tinifyRes,
      S3UploadRes,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

export const fetchCache = "force-no-store";

