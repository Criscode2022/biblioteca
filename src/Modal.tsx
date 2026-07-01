import { useEffect } from "react";
import { useI18n } from "./i18n/I18nContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
  /** Close-button styling: "dark" for dark/gradient panels, "light" for white ones. */
  tone?: "dark" | "light";
  /** Max width of the centered panel on >= sm screens. */
  maxWidthClassName?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  panelClassName = "",
  tone = "dark",
  maxWidthClassName = "sm:max-w-md",
}: ModalProps) => {
  const { t } = useI18n();

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const closeClasses =
    tone === "dark"
      ? "bg-white/15 text-white hover:bg-white/30"
      : "bg-slate-100 text-slate-500 hover:bg-slate-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[92vh] w-full animate-fade-in-up overflow-y-auto rounded-t-3xl shadow-2xl sm:rounded-3xl ${maxWidthClassName} ${panelClassName}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("modal.close")}
          className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full transition ${closeClasses}`}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
