import { useI18n } from "./i18n/I18nContext";
import Modal from "./Modal";

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** "free" when running offline, "pro" when signed in to cloud mode. */
  currentPlan: "free" | "pro";
}

const PlansModal = ({ isOpen, onClose, currentPlan }: PlansModalProps) => {
  const { t } = useI18n();

  const plans = [
    {
      id: "free" as const,
      name: t("plans.free.name"),
      price: t("plans.free.price"),
      features: [t("plans.free.f1"), t("plans.free.f2"), t("plans.free.f3")],
      highlight: false,
    },
    {
      id: "pro" as const,
      name: t("plans.pro.name"),
      price: t("plans.pro.price"),
      features: [t("plans.pro.f1"), t("plans.pro.f2"), t("plans.pro.f3")],
      highlight: true,
    },
    {
      id: "enterprise" as const,
      name: t("plans.enterprise.name"),
      price: t("plans.enterprise.price"),
      features: [
        t("plans.enterprise.f1"),
        t("plans.enterprise.f2"),
        t("plans.enterprise.f3"),
      ],
      highlight: false,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      tone="light"
      maxWidthClassName="sm:max-w-3xl"
      panelClassName="bg-white p-6 sm:p-8"
    >
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-900">
          {t("plans.title")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t("plans.subtitle")}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-5 ${
                plan.highlight
                  ? "border-brand-300 bg-brand-50/50 shadow-card"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  {plan.name}
                </h3>
                {isCurrent && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {t("plans.current")}
                  </span>
                )}
              </div>
              <p className="mt-2 font-serif text-3xl font-bold text-slate-900">
                {plan.price}
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.id === "enterprise" && (
                <a
                  href="mailto:hola@biblioteca.cloud"
                  className="btn-secondary mt-4 w-full"
                >
                  {t("plans.contact")}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default PlansModal;
