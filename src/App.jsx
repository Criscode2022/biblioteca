import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import FiltroLibros from './FiltroLibros.jsx';
import FormularioLibros from './FormularioLibros';
import ListaLibros from './ListaLibros';

const App = () => {
  const [libros, setLibros] = useState(JSON.parse(localStorage.getItem('libros')) || []);
  const [filtros, setFiltros] = useState({ titulo: "", autor: "", year: null, editorial: "" });
  const [filteredLibros, setFilteredLibros] = useState(libros);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      libros.map(libro => {
        const { imagen, ...libroSinImagen } = libro;
        return libroSinImagen;
      })
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Libros");
    XLSX.writeFile(wb, `libros.xlsx`);
  }

  useEffect(() => {
    localStorage.setItem('libros', JSON.stringify(libros));
  }, [libros]);

  useEffect(() => {
    setFilteredLibros(
      libros.filter(libro => {
        return (
          (filtros.titulo ? libro.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()) : true) &&
          (filtros.autor ? libro.autor.toLowerCase().includes(filtros.autor.toLowerCase()) : true) &&
          (filtros.year ? parseInt(libro.year) === parseInt(filtros.year) : true) &&
          (filtros.editorial ? libro.editorial.toLowerCase().includes(filtros.editorial.toLowerCase()) : true)
        );
      })
    );
  }, [libros, filtros]);



  const addLibro = (titulo, autor, year, editorial, imagen) => {
    setLibros((librosPrevios) => [
      ...librosPrevios,
      { id: Math.random(), titulo, autor, year, editorial, imagen }
    ]);
  };

  const eliminarLibro = (id) => {
    setLibros(libros.filter(libro => libro.id !== id));
  };

  return (
    <div className="App">
      <h1 className='title'>Biblioteca</h1>
      <div className="app-container">

        <div className="sidebar">
          <FormularioLibros addLibro={addLibro} />
        </div>
        <div className="main-content">
          <FiltroLibros filtros={filtros} setFiltros={setFiltros} />
          <ListaLibros libros={filteredLibros} eliminarLibro={eliminarLibro} />
          <div id='flex'>
            <button className="text-black bg-white" onClick={exportToExcel}>Descargar libros como XLSX</button>
            <button
              className="text-black bg-white"
              onClick={() => {
                const data = JSON.stringify(libros);
                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(data)}`;
                const link = document.createElement('a');
                link.href = dataUri;
                link.download = 'libros.json';
                link.click();
              }}
            >

              Exportar libros
            </button>



            <label>
              Importar libros:
              <input
                type="file"
                accept=".json"
                onChange={e => {
                  const fileReader = new FileReader();
                  fileReader.readAsText(e.target.files[0], "UTF-8");
                  fileReader.onload = e => {
                    setLibros(JSON.parse(e.target.result));
                  };
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
