// Compresión de imágenes subidas desde el admin: evita pisar el límite de payload
// de Vercel (4.5MB fijo en Serverless Functions) con fotos de cámara/celular pesadas.

// Solo se reduce (resolución + recompresión) si el archivo original supera esto.
// Por debajo, se conserva la resolución/calidad natural.
export const MAX_UNCOMPRESSED_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 1920;

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = src;
  });
}

// Recorta (si se pasa `area`) y comprime un object URL, solo reduciendo resolución/calidad
// si `sourceSize` (el peso del archivo original) supera el umbral.
export async function exportImage(src: string, sourceSize: number, area?: Area): Promise<File> {
  const img = await loadImage(src);
  const crop = area ?? { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight };
  const needsCompression = sourceSize > MAX_UNCOMPRESSED_BYTES;
  const scale = needsCompression ? Math.min(1, MAX_DIMENSION / Math.max(crop.width, crop.height)) : 1;
  const outWidth = Math.round(crop.width * scale);
  const outHeight = Math.round(crop.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  canvas.getContext("2d")!.drawImage(
    img,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, outWidth, outHeight,
  );

  const quality = needsCompression ? 0.85 : 0.92;
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(new File([blob!], "image.jpg", { type: "image/jpeg" })), "image/jpeg", quality),
  );
}

// Para uploads sin recorte manual: si el archivo ya pesa poco, se sube tal cual.
export async function compressIfNeeded(file: File): Promise<File> {
  if (file.size <= MAX_UNCOMPRESSED_BYTES) return file;
  const src = URL.createObjectURL(file);
  try {
    return await exportImage(src, file.size);
  } finally {
    URL.revokeObjectURL(src);
  }
}
