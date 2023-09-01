import { useState } from 'react';
import './FormularioLibros.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const FormularioLibros = ({ addLibro }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [imagen, setImagen] = useState('');
  const [year, setYear] = useState('');
  const [editorial, setEditorial] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto">
      <h2 className="text-2xl font-bold mb-4">Añadir libro</h2>

      <div className="flex">
          <input
            type="text"
            placeholder='Título'
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
            maxLength={60}
          />
      </div>

      <div className="flex">
          <input
            type="text"
            placeholder='Autor'
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
            maxLength={40}

          />
      </div>

      <div className="flex">
          <input
            type="number"
            placeholder='Año'
            value={year}  
            onChange={(e) => {
              const value = Number(e.target.value);
              setYear(isNaN(value) ? '' : value.toString());  
            }}
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
            max={9999}
          />
      </div>

      <div className="flex">
          <input
            type="text"
            placeholder='Editorial'
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
            maxLength={30}
          />
      </div>

      <div id='divIMG' className="flex">
        <label className="block mb-4 flex-grow">
          Selecciona la portada del libro:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />
        </label>
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
