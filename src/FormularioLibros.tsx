import { useState } from "react";
import { useI18n } from "./i18n/I18nContext";
import type { NewBook } from "./types";

interface FormularioLibrosProps {
  addLibro: (book: NewBook) => Promise<void>;
}

const FormularioLibros = ({ addLibro }: FormularioLibrosProps) => {
  const { t } = useI18n();
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [imagen, setImagen] = useState("");
  const [year, setYear] = useState("");
  const [editorial, setEditorial] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitulo("");
    setAutor("");
    setImagen("");
    setYear("");
    setEditorial("");
    setFileName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titulo || !autor || !year || !editorial) {
      setErrorMsg(t("form.errorRequired"));
      return;
    }

    const validYear = parseInt(year, 10);
    if (!validYear || year.length > 5) {
      setErrorMsg(t("form.errorYear"));
      return;
    }

    setErrorMsg("");
    setSubmitting(true);
    try {
      await addLibro({ titulo, autor, year: validYear, editorial, imagen });
      resetForm();
    } catch {
      setErrorMsg(t("form.errorSave"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName("");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setImagen(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">{t("form.title")}</h2>
        <p className="mt-1 text-sm text-brand-200">{t("form.subtitle")}</p>
      </div>

      <div>
        <label className="field-label text-brand-100" htmlFor="titulo">
          {t("form.bookTitle")}
        </label>
        <input
          id="titulo"
          type="text"
          placeholder={t("form.bookTitlePlaceholder")}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="field"
          maxLength={60}
          required
        />
      </div>

      <div>
        <label className="field-label text-brand-100" htmlFor="autor">
          {t("form.author")}
        </label>
        <input
          id="autor"
          type="text"
          placeholder={t("form.authorPlaceholder")}
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="field"
          maxLength={40}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label text-brand-100" htmlFor="year">
            {t("form.year")}
          </label>
          <input
            id="year"
            type="number"
            placeholder="1967"
            value={year}
            onChange={(e) => {
              const value = Number(e.target.value);
              setYear(isNaN(value) ? "" : value.toString());
            }}
            className="field"
            max={9999}
          />
        </div>
        <div>
          <label className="field-label text-brand-100" htmlFor="editorial">
            {t("form.publisher")}
          </label>
          <input
            id="editorial"
            type="text"
            placeholder={t("form.publisherPlaceholder")}
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
            className="field"
            maxLength={30}
            required
          />
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => document.getElementById("fileInput")?.click()}
          className="btn-ghost w-full"
        >
          {imagen ? t("form.changeCover") : t("form.addCover")}
        </button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {fileName && (
          <p className="mt-2 truncate text-xs text-brand-200">
            {t("form.selectedFile")} <strong className="text-white">{fileName}</strong>
          </p>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200 ring-1 ring-rose-400/30">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn bg-white text-brand-800 shadow-lg hover:bg-brand-50"
      >
        {submitting ? t("form.saving") : t("form.submit")}
      </button>
    </form>
  );
};

export default FormularioLibros;
