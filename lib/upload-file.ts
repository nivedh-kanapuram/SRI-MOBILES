import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const isDev = !process.env.VERCEL;

type UploadResult = { url: string };

export async function uploadFile(
  fileName: string,
  file: File,
  subDir: string,
): Promise<UploadResult> {
  if (isDev) {
    const dir = path.join(process.cwd(), 'public', 'uploads', subDir);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, new Uint8Array(bytes));
    return { url: `/uploads/${subDir}/${fileName}` };
  }

  const { url } = await put(`uploads/${subDir}/${fileName}`, file, {
    access: 'public',
  });
  return { url };
}