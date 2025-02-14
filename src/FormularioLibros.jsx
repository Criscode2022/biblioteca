import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

const FormularioLibros = ({ addLibro }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [imagen, setImagen] = useState('');
  const [year, setYear] = useState('');
  const [editorial, setEditorial] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [fileName, setFileName] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo || !autor || !year || !editorial) {
      setErrorMsg("Por favor, rellena todos los campos.");
      return;
    }

    const validYear = parseInt(year);
    if (!validYear || year.length > 5) {
      setErrorMsg("Por favor, introduce un año válido.");
      return;
    }

    setErrorMsg('');

    addLibro(titulo, autor, validYear, editorial, imagen);
    setTitulo('');
    setAutor('');
    setImagen('');
    setYear('');
    setEditorial('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mt-2 text-white mb-4">Añadir libro</h2>

      <div className="flex">
        <input
          type="text"
          placeholder='Título*'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md "
          maxLength={60}
          required
        />
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder='Autor*'
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md "
          maxLength={40}
          required
        />
      </div>

      <div className="flex">
        <input
          type="number"
          placeholder='Año*'
          value={year}
          onChange={(e) => {
            const value = Number(e.target.value);
            setYear(isNaN(value) ? '' : value.toString());
          }}
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md "
          max={9999}
        />
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder='Editorial*'
          value={editorial}
          onChange={(e) => setEditorial(e.target.value)}
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md "
          maxLength={30}
          required
        />
      </div>
      <div className="flex mt-2 flex-col">
        <button
          type="button"
          onClick={() => document.getElementById("fileInput").click()}
          className="text-black bg-white">
          (Opcional) Carátula
        </button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {fileName && (
          <p className="text-lime-300 mt-2">
            Archivo seleccionado: <strong>{fileName}</strong>
          </p>
        )}
      </div>


      {errorMsg && <div className="mt-3 text-red-500">{errorMsg}</div>}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded mt-4"
        style={{ backgroundColor: '#1a202c' }}
      >
        Añadir libro
      </button>
    </form>
  );
};

export default FormularioLibros;
