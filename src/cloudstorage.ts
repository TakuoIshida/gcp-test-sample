import { Storage } from '@google-cloud/storage';
import { Readable } from 'stream';

const storage = new Storage();

export const readBucketFile = async (
  bucketName: string,
  filePath: string,
): Promise<Readable | null> => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);
  const exists = await file.exists();
  if (!exists[0]) return null;

  return file.createReadStream();
};

export const uploadFile = async (
  bucketName: string,
  filePath: string,
  data: Buffer | string,
): Promise<void> => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);
  await file.save(data);
};

export const deleteFile = async (
  bucketName: string,
  filePath: string,
): Promise<void> => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);
  await file.delete();
};
