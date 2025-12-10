import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { getR2Client, getR2PublicUrl } from '@/lib/r2';

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/postscript',
  'application/x-photoshop',
  'image/vnd.adobe.photoshop',
  'image/png',
]);

const ALLOWED_EXT = new Set(['pdf', 'ai', 'psd', 'png']);
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

function sanitizeFilename(name: string) {
  return name
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(req: Request) {
  try {
    if (!process.env.R2_BUCKET) {
      return NextResponse.json({ error: 'Storage bucket is not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { filename, contentType, size } = body as { filename?: string; contentType?: string; size?: number };

    if (!filename || !contentType || typeof size !== 'number') {
      return NextResponse.json({ error: 'filename, contentType и size обязательны' }, { status: 400 });
    }

    if (size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Файл превышает 50MB' }, { status: 400 });
    }

    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_MIME.has(contentType) || !ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: 'Недопустимый тип файла. Разрешены: PDF, AI, PSD, PNG' }, { status: 400 });
    }

    const key = `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFilename(filename)}`;

    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 }); // 10 minutes

    return NextResponse.json({
      uploadUrl,
      key,
      url: getR2PublicUrl(key),
    });
  } catch (error) {
    console.error('upload.presign.error', error);
    return NextResponse.json({ error: 'Не удалось подготовить загрузку' }, { status: 500 });
  }
}
