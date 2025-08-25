// ModalPortal.tsx
import { createPortal } from "react-dom";

export default function ModalPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof document === "undefined") return null; // SSR guard
  return createPortal(children, document.body);
}
