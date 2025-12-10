import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_EXT = new Set(['pdf', 'ai', 'psd', 'png']);
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/postscript',
  'application/x-photoshop',
  'image/vnd.adobe.photoshop',
  'image/png',
]);

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = (formData.get('userId') as string | null) || 'anonymous';

    if (!file) {
      return NextResponse.json({ error: 'Файл обязателен' }, { status: 400 });
    }

    const size = file.size;
    const type = file.type || 'application/octet-stream';
    const filename = sanitizeFilename(file.name || 'file');
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_EXT.has(ext) || !ALLOWED_MIME.has(type)) {
      return NextResponse.json({ error: 'Недопустимый тип файла. Разрешены: PDF, AI, PSD, PNG' }, { status: 400 });
    }

    if (size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Файл превышает 50MB' }, { status: 400 });
    }

    const baseDir = process.env.UPLOAD_DIR || '/opt/print-designcorp/uploads';
    const datedDir = path.join(baseDir, userId, new Date().toISOString().slice(0, 10));
    await fs.mkdir(datedDir, { recursive: true });

    const key = `${crypto.randomUUID()}-${filename}`;
    const fullPath = path.join(datedDir, key);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buffer);

    const relativeKey = path.relative(baseDir, fullPath);
    const publicUrl = `/api/uploads/${encodeURIComponent(relativeKey)}`;

    return NextResponse.json({
      key: relativeKey,
      url: publicUrl,
      name: filename,
      size,
      type,
    });
  } catch (error) {
    console.error('upload.local.error', error);
    return NextResponse.json({ error: 'Не удалось сохранить файл' }, { status: 500 });
  }
}
