import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';


const Libro = ({ libro, eliminarLibro }) => {
  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Img variant="top" src={libro.imagen} style={{ width: '100%', height: 'auto' }} />
      <Card.Body>
        <Card.Title>{libro.titulo}</Card.Title>
        <Card.Text>
          <strong>Autor</strong>: {libro.autor}<br />
          <strong>Año</strong>: {libro.year}<br />
          <strong>Editorial</strong>: {libro.editorial}
        </Card.Text>
        <ButtonGroup aria-label="Basic example">
          <Button variant="danger" className='text-black hover:!text-white mt-4' onClick={() => eliminarLibro(libro.id)}>Eliminar</Button>
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
  eliminarLibro: PropTypes.func.isRequired,
};


export default Libro;