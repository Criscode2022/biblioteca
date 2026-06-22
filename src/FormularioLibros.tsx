import { useState } from "react";

interface FormularioLibrosProps {
  addLibro: (
    titulo: string,
    autor: string,
    year: number,
    editorial: string,
    imagen: string,
  ) => void;
}

const FormularioLibros = ({ addLibro }: FormularioLibrosProps) => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [imagen, setImagen] = useState("");
  const [year, setYear] = useState("");
  const [editorial, setEditorial] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  const resetForm = () => {
    setTitulo("");
    setAutor("");
    setImagen("");
    setYear("");
    setEditorial("");
    setFileName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titulo || !autor || !year || !editorial) {
      setErrorMsg("Por favor, rellena todos los campos.");
      return;
    }

    const validYear = parseInt(year, 10);
    if (!validYear || year.length > 5) {
      setErrorMsg("Por favor, introduce un año válido.");
      return;
    }

    setErrorMsg("");
    addLibro(titulo, autor, validYear, editorial, imagen);
    resetForm();
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
        <h2 className="font-serif text-2xl font-bold text-white">Añadir libro</h2>
        <p className="mt-1 text-sm text-brand-200">Completa los datos del ejemplar.</p>
      </div>

      <div>
        <label className="field-label text-brand-100" htmlFor="titulo">
          Título *
        </label>
        <input
          id="titulo"
          type="text"
          placeholder="Ej. Cien años de soledad"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="field"
          maxLength={60}
          required
        />
      </div>

      <div>
        <label className="field-label text-brand-100" htmlFor="autor">
          Autor *
        </label>
        <input
          id="autor"
          type="text"
          placeholder="Ej. Gabriel García Márquez"
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
            Año *
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
            Editorial *
          </label>
          <input
            id="editorial"
            type="text"
            placeholder="Sudamericana"
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
          {imagen ? "Cambiar carátula" : "Añadir carátula (opcional)"}
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
            Seleccionado: <strong className="text-white">{fileName}</strong>
          </p>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200 ring-1 ring-rose-400/30">
          {errorMsg}
        </div>
      )}

      <button type="submit" className="btn bg-white text-brand-800 shadow-lg hover:bg-brand-50">
        Añadir libro
      </button>
    </form>
  );
};

export default FormularioLibros;
