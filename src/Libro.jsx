import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';


const Libro = ({ libro, deleteBook }) => {
  return (
    <Card className='w-full sm:w-72'>
      <Card.Img variant="top" src={libro.imagen ? libro.imagen : `https://placehold.co/700x800?text=${encodeURIComponent(libro.titulo)}`}
        className='max-h-64 sm:max-h-56 sm:w-52 rounded-lg w-56 m-auto' />
      <Card.Body>
        <Card.Title>{libro.titulo}</Card.Title>
        <Card.Text>
          <strong>Autor</strong>: {libro.autor}<br />
          <strong>Año</strong>: {libro.year}<br />
          <strong>Editorial</strong>: {libro.editorial}
        </Card.Text>
        <ButtonGroup aria-label="Basic example">
          <Button variant="danger" className='text-black hover:!text-white mt-4' onClick={() => deleteBook(libro.id)}>Eliminar</Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

Libro.propTypes = {
  libro: PropTypes.shape({
    imagen: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    autor: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    editorial: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  deleteBook: PropTypes.func.isRequired,
};


export default Libro;