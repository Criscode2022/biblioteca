import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}

/** Simple confirm/cancel dialog for auth and sync flows. */
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDialogProps) => (
  <Modal
    isOpen={isOpen}
    onClose={busy ? () => {} : onCancel}
    panelClassName="bg-white p-6 sm:p-8"
    showCloseButton={false}
  >
    <h2 className="font-serif text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
    <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        className="btn-secondary w-full sm:w-auto"
        onClick={onCancel}
        disabled={busy}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        className="btn-primary w-full sm:w-auto"
        onClick={onConfirm}
        disabled={busy}
      >
        {busy ? "Procesando…" : confirmLabel}
      </button>
    </div>
  </Modal>
);

interface ChoiceDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onCancel: () => void;
  busy?: boolean;
}

/** Two-option dialog (e.g. logout: keep cloud books vs restore local snapshot). */
export const ChoiceDialog = ({
  isOpen,
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onCancel,
  busy = false,
}: ChoiceDialogProps) => (
  <Modal
    isOpen={isOpen}
    onClose={busy ? () => {} : onCancel}
    panelClassName="bg-white p-6 sm:p-8"
    showCloseButton={false}
  >
    <h2 className="font-serif text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
    <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
    <div className="mt-6 flex flex-col gap-2">
      <button
        type="button"
        className="btn-primary w-full"
        onClick={onPrimary}
        disabled={busy}
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        className="btn-secondary w-full"
        onClick={onSecondary}
        disabled={busy}
      >
        {secondaryLabel}
      </button>
      <button
        type="button"
        className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        onClick={onCancel}
        disabled={busy}
      >
        Cancelar
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
