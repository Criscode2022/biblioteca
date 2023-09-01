import React from "react";
import PropTypes from "prop-types";
import "./FiltroLibros.css";

const FiltroLibros = ({ filtros, setFiltros }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convertir año a número
    const finalValue = name === "year" ? Number(value) : value;
    setFiltros((prevFilters) => ({ ...prevFilters, [name]: finalValue }));
  };

  return (
    <div className="filters-container">
      <label className="mb-4">
        Título:
        <input
          placeholder="Filtrar"
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
          type="text"
          name="titulo"
          value={filtros.titulo || ""}
          onChange={handleChange}
          maxLength={60}

        />
      </label>
      
      <label className="mb-4">
        Autor:
        <input
          placeholder="Filtrar"
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
          type="text"
          name="autor"
          value={filtros.autor || ""}
          onChange={handleChange}
          maxLength={40}
        />
      </label>

      <label className="mb-4">
        Año:
        <input
          placeholder="Filtrar"
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
          type="number"
          name="year"
          value={filtros.year || ""}
          onChange={handleChange}
          max={9999}
        />
      </label>

      <label className="mb-4">
        Editorial:
        <input
          placeholder="Filtrar"
          className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md dark:text-white"
          type="text"
          name="editorial"
          value={filtros.editorial || ""}
          onChange={handleChange}
          maxLength={30}
        />
      </label>
    </div>
  );
};

FiltroLibros.propTypes = {
  filtros: PropTypes.shape({
    titulo: PropTypes.string,
    autor: PropTypes.string,
    year: PropTypes.number,
    editorial: PropTypes.string
  }).isRequired,
  setFiltros: PropTypes.func.isRequired
};

export default FiltroLibros;
