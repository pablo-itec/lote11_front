"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { X, Check } from "lucide-react";

interface Props {
  src: string;
  aspect: number;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

async function cropImageToFile(src: string, crop: Area): Promise<File> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = src;
  });

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  canvas.getContext("2d")!.drawImage(
    img,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, crop.width, crop.height,
  );

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(new File([blob!], "cropped.jpg", { type: "image/jpeg" })), "image/jpeg", 0.92),
  );
}

export default function ImageCropperModal({ src, aspect, onConfirm, onCancel }: Props) {
  const [crop, setCrop]           = useState({ x: 0, y: 0 });
  const [zoom, setZoom]           = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving]       = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedArea) return;
    setSaving(true);
    try {
      const file = await cropImageToFile(src, croppedArea);
      onConfirm(file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
      <div className="glass-panel rounded-[28px] flex flex-col gap-4 p-5 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand-cream/60">
            Recortar imagen
          </span>
          <button onClick={onCancel} className="text-brand-cream/30 hover:text-brand-cream">
            <X size={16} />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative rounded-[16px] overflow-hidden bg-black/40" style={{ height: 320 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-brand-cream/30 w-10">
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-brand-brown"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="abtn abtn-del px-5 py-2">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="abtn abtn-edit px-5 py-2 flex items-center gap-1.5"
          >
            <Check size={11} />
            {saving ? "Procesando..." : "Recortar"}
          </button>
        </div>
      </div>
    </div>
  );
}
