import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Legal documents at one honest price";

export default function Image() {
  return ogImage({ eyebrow: "No subscription. No account.", title: "Legal documents at one honest price.", footer: "Preview free · Pay once · Keep forever" });
}
