import PropTypes from "prop-types";

const FiltroLibros = ({ filtros, setFiltros }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;

    const finalValue = name === "year" ? Number(value) : value;
    setFiltros((prevFilters) => ({ ...prevFilters, [name]: finalValue }));
  };

  return (
    <>
      <div className="hidden md:flex justify-end gap-4">

        <label className="font-semibold mb-4">
          Título
          <input
            placeholder="Buscar por título"
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md"
            type="text"
            name="titulo"
            value={filtros.titulo || ""}
            onChange={handleChange}
            maxLength={60}
          />
        </label>

        <label className="font-semibold mb-4">
          Autor
          <input
            placeholder="Buscar por autor"
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md"
            type="text"
            name="autor"
            value={filtros.autor || ""}
            onChange={handleChange}
            maxLength={40}
          />
        </label>

        <label className="font-semibold mb-4">
          Año
          <input
            placeholder="Buscar por año"
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md "
            type="number"
            name="year"
            value={filtros.year || ""}
            onChange={handleChange}
            max={9999}
          />
        </label>

        <label className="font-semibold mb-4">
          Editorial
          <input
            placeholder="Buscar por editorial"
            className="border border-gray-300 px-3 py-2 mt-1 rounded w-full max-w-md "
            type="text"
            name="editorial"
            value={filtros.editorial || ""}
            onChange={handleChange}
            maxLength={30}
          />
        </label>
      </div>

      <div className="md:hidden flex flex-col">
        <details>
          <summary className="bg-white  rounded shadow-sm px-4 py-2 mb-2">Buscar</summary>

          <label className="w-full font-semibold mb-4">
            Título
            <input
              placeholder="Título"
              className="w-full py-2 mt-1 rounded "
              type="text"
              name="titulo"
              value={filtros.titulo || ""}
              onChange={handleChange}
              maxLength={60}
            />
          </label>

          <label className="w-full font-semibold mb-4">
            Autor
            <input
              placeholder="Autor"
              className="w-full py-2 mt-1 rounded "
              type="text"
              name="autor"
              value={filtros.autor || ""}
              onChange={handleChange}
              maxLength={40}
            />
          </label>

          <label className="w-full font-semibold mb-4">
            Año
            <input
              placeholder="Año"
              className="w-full px-3 py-2 mt-1 rounded max-w-md "
              type="number"
              name="year"
              value={filtros.year || ""}
              onChange={handleChange}
              max={9999}
            />
          </label>
          <label className="w-full font-semibold mb-4">
            Editorial
            <input
              placeholder="Editorial"
              className="w-full px-3 py-2 mt-1 rounded max-w-md "
              type="text"
              name="editorial"
              value={filtros.editorial || ""}
              onChange={handleChange}
              maxLength={30}
            />
          </label>
        </details>
      </div>
    </>
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
