import Libro from './Libro';
import './ListaLibros.css';

const ListaLibros = ({ libros, deleteBook }) => (
  <div id='listaLibros' className="flex flex-wrap justify-center gap-4 mb-4">
    {libros.map((libro, index) => (
      <Libro
        key={index}
        libro={libro}
        deleteBook={deleteBook}
      />
    ))}
  </div>
);

export default ListaLibros;
