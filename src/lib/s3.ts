import * as Minio from "minio";
import {
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_USE_SSL,
  MINIO_BUCKET_NAME,
  MINIO_REGION,
} from "../constants";

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT!,
  useSSL: MINIO_USE_SSL,
  accessKey: MINIO_ACCESS_KEY!,
  secretKey: MINIO_SECRET_KEY!,
  region: MINIO_REGION!,
});

export const ensureBucketExists = async (): Promise<void> => {
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET_NAME!);
    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET_NAME!, "us-east-1");
      console.log(`Bucket ${MINIO_BUCKET_NAME} created successfully.`);
    }
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    throw error;
  }
};

export const uploadFile = async (objectName: string, buffer: Buffer, contentType?: string): Promise<string> => {
  try {
    await ensureBucketExists();

    const metaData = contentType ? { "Content-Type": contentType } : {};

    await minioClient.putObject(MINIO_BUCKET_NAME!, objectName, buffer, buffer.length, metaData);

    console.log(`File ${objectName} uploaded successfully.`);
    return objectName;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getFile = async (objectName: string): Promise<Buffer> => {
  try {
    const dataStream = await minioClient.getObject(MINIO_BUCKET_NAME!, objectName);

    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      dataStream.on("data", (chunk) => chunks.push(chunk));
      dataStream.on("end", () => resolve(Buffer.concat(chunks)));
      dataStream.on("error", reject);
    });
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
};

export const getPresignedUrl = async (
  objectName: string,
  expiry: number = 7 * 24 * 60 * 60, // 7 days in seconds
): Promise<string> => {
  try {
    const url = await minioClient.presignedGetObject(MINIO_BUCKET_NAME!, objectName, expiry);
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
};

export const deleteFile = async (objectName: string): Promise<void> => {
  try {
    await minioClient.removeObject(MINIO_BUCKET_NAME!, objectName);
    console.log(`File ${objectName} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const listFiles = async (prefix?: string): Promise<string[]> => {
  try {
    const objectsList: string[] = [];
    const stream = minioClient.listObjects(MINIO_BUCKET_NAME!, prefix, true);

    return new Promise((resolve, reject) => {
      stream.on("data", (obj) => objectsList.push(obj.name!));
      stream.on("end", () => resolve(objectsList));
      stream.on("error", reject);
    });
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

export { minioClient };
