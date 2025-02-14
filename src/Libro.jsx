import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';


const Libro = ({ libro, deleteBook }) => {
  return (
    <Card className='w-full sm:w-72'>
      <Card.Img variant="top" src={libro.imagen ? libro.imagen : `https://placehold.co/700x800?text=${encodeURIComponent(libro.titulo)}`}
        className='max-h-64 sm:max-h-52 sm:w-52 rounded-lg w-56 m-auto' />
      <Card.Body>
        <Card.Title className='italic'>{libro.titulo}</Card.Title>
        <Card.Text>
          <div className="flex flex-col items-start">
            <div><strong>Autor</strong>: {libro.autor}<br /></div>
            <div><strong>Año</strong>: {libro.year}<br /></div>
            <div><strong>Editorial</strong>: {libro.editorial}</div>
          </div>
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