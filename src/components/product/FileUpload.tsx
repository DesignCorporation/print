'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export type UploadedFile = {
  name: string;
  size: number;
  type: string;
  key: string;
  url: string;
};

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_EXT = ['pdf', 'ai', 'psd', 'png'];

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function FileUpload({ onChange }: { onChange: (files: UploadedFile[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setError(null);
      setUploading(true);

      const nextFiles: UploadedFile[] = [...files];

      for (const file of Array.from(fileList)) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXT.includes(ext)) {
          setError('Разрешены только PDF, AI, PSD, PNG');
          continue;
        }
        if (file.size > MAX_SIZE) {
          setError('Файл превышает 50MB');
          continue;
        }

        try {
          const formData = new FormData();
          formData.append('file', file);
          // userId можно добавить, когда будет auth/другой идентификатор

          const res = await fetch('/api/uploads', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Не удалось загрузить файл');
          }

          const { key, url, name, size: savedSize, type } = await res.json();

          nextFiles.push({
            name: name || file.name,
            size: savedSize ?? file.size,
            type: type || file.type,
            key,
            url,
          });
        } catch (err: any) {
          console.error('upload.error', err);
          setError(err.message || 'Ошибка загрузки файла');
        }
      }

      setFiles(nextFiles);
      onChange(nextFiles);
      setUploading(false);
    },
    [files, onChange]
  );

  return (
    <div className="space-y-3">
      <label className="font-semibold text-sm text-gray-800">Загрузите макет</label>
      <label
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-brand-400 rounded-xl px-4 py-10 cursor-pointer bg-gray-50 hover:bg-brand-50 transition"
      >
        <UploadCloud className="text-brand-600" />
        <div className="text-sm text-gray-700 font-medium">Перетащите файлы или нажмите, чтобы выбрать</div>
        <div className="text-xs text-gray-500">PDF, AI, PSD, PNG до 50MB</div>
        <input
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.ai,.psd,.png,application/pdf,application/postscript,image/png"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {uploading && <div className="text-sm text-gray-500">Загрузка...</div>}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.key}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-xs text-gray-500">{formatSize(file.size)}</div>
                </div>
              </div>
              <a className="text-brand-600 text-xs hover:underline" href={file.url} target="_blank" rel="noreferrer">
                Открыть
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
