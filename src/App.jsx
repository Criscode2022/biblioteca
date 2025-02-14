import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import FiltroLibros from './FiltroLibros.jsx';
import FormularioLibros from './FormularioLibros';
import ListaLibros from './ListaLibros';

const App = () => {
  const [books, setBooks] = useState(JSON.parse(localStorage.getItem('books')) || []);
  const [filters, setFilters] = useState({ titulo: "", autor: "", year: null, editorial: "" });
  const [filteredBooks, setFilteredBooks] = useState(books);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    setFilteredBooks(
      books.filter(libro => {
        return (
          (filters.titulo ? libro.titulo.toLowerCase().includes(filters.titulo.toLowerCase()) : true) &&
          (filters.autor ? libro.autor.toLowerCase().includes(filters.autor.toLowerCase()) : true) &&
          (filters.year ? parseInt(libro.year) === parseInt(filters.year) : true) &&
          (filters.editorial ? libro.editorial.toLowerCase().includes(filters.editorial.toLowerCase()) : true)
        );
      })
    );
  }, [books, filters]);

  const exportToExcel = () => {
    const formattedData = books.map(({ id, imagen, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Libros");

    XLSX.writeFile(workbook, "libros.xlsx");
  };

  const addBook = (titulo, autor, year, editorial, imagen) => {
    setBooks((existingBooks) => [
      ...existingBooks,
      { id: Math.random(), titulo, autor, year, editorial, imagen }
    ]);
  };

  const deleteBook = (id) => {
    setBooks(books.filter(libro => libro.id !== id));
  };

  return (
    <>

      <h1 className='text-4xl sm:text-8xl'>Biblioteca</h1>

      <div className="flex w-full flex-col-reverse justify-center items-center md:flex-row md:items-start md:justify-between">

        <div className="sidebar hidden md:block w-full md:w-auto font-bold p-3 m-2 md:!m-8">
          <FormularioLibros addLibro={addBook} />
        </div>
        <main className="p-4 w-full">
          <FiltroLibros filtros={filters} setFiltros={setFilters} />
          <ListaLibros libros={filteredBooks} deleteBook={deleteBook} />

          <div className='flex flex-col md:flex-row justify-end gap-2 md:!gap-4'>
            <button className="btn text-black bg-white" onClick={exportToExcel} disabled={!books.length}>Descargar Excel</button>
            <button
              className="btn text-black bg-white"
              onClick={() => {
                const data = JSON.stringify(books);
                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(data)}`;
                const link = document.createElement('a');
                link.href = dataUri;
                link.download = 'books.json';
                link.click();
              }}
              disabled={!books.length}
            >
              Exportar libros
            </button>
            <button className="btn text-black bg-white" onClick={() => document.getElementById("importInput").click()}
            >Importar libros</button>

            <div className="md:hidden sidebar md:w-auto font-bold p-3 my-2 md:!m-8">
              <FormularioLibros addLibro={addBook} />
            </div>
          </div>

          <input
            id="importInput"
            type="file"
            accept="image/*"
            onChange={e => {
              const fileReader = new FileReader();
              fileReader.readAsText(e.target.files[0], "UTF-8");
              fileReader.onload = e => {
                setBooks(JSON.parse(e.target.result));
              };
            }} className="hidden"
          />

        </main>
      </div>
    </>
  );
};

export default App;
