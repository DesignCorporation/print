import { S3Client } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET;

export function getR2Client() {
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !accountId) {
    throw new Error('R2 credentials are not configured');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export function getR2PublicUrl(key: string) {
  const publicBase =
    process.env.R2_PUBLIC_URL ||
    (accountId && bucket ? `https://${bucket}.${accountId}.r2.cloudflarestorage.com` : '');

  return publicBase ? `${publicBase}/${key}` : '';
}
