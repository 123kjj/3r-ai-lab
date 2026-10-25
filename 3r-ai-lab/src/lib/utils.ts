import { ThreeRAction } from "./types";

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export const ACTION_META: Record<
  ThreeRAction,
  { label: string; icon: string; color: string; bg: string }
> = {
  reduce: { label: "Reduce", icon: "🟢", color: "text-moss-700", bg: "bg-moss-100" },
  reuse: { label: "Reuse", icon: "🔵", color: "text-soil-700", bg: "bg-soil-100" },
  recycle: { label: "Recycle", icon: "♻️", color: "text-moss-800", bg: "bg-moss-100" },
};

/** Reads a file and downscales it (max 1024px, JPEG) so uploads stay well under serverless body limits and AI calls are faster. */
export function fileToDataUrl(file: File, maxSide = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const raw = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(raw);
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(raw);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } catch {
          resolve(raw);
        }
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}
