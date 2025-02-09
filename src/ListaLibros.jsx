import Libro from './Libro';
import './ListaLibros.css';

const ListaLibros = ({ libros, eliminarLibro }) => (
  <div id='listaLibros' className="d-flex flex-wrap justify-content-center">
    {libros.map((libro, index) => (
      <Libro
        key={index}
        libro={libro}
        eliminarLibro={eliminarLibro}
      />
    ))}
  </div>
);

export default ListaLibros;
