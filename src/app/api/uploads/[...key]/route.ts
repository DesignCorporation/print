import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  ai: 'application/postscript',
  psd: 'application/octet-stream',
  png: 'image/png',
};

export async function GET(_: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: keyParts } = await params;
  const key = keyParts?.join('/') || '';
  const baseDir = process.env.UPLOAD_DIR || '/opt/print-designcorp/uploads';
  const resolved = path.resolve(baseDir, key);

  if (!resolved.startsWith(path.resolve(baseDir))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await fs.readFile(resolved);
    const ext = path.extname(resolved).replace('.', '').toLowerCase();
    const mime = MIME_BY_EXT[ext] || 'application/octet-stream';
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Disposition': `inline; filename="${path.basename(resolved)}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
