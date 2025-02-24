import React, { useState } from 'react';
import axios from 'axios';

export default function Api() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const url = 'https://www.omdbapi.com/';
  const apikey = 'af0dd161';

  // https://www.omdbapi.com/?apikey=af0dd161&s=batman

  const fetchData = async () => {
    if (!search) return;
    setLoading(true);
    setError('');
    setSelectedMovie(null);
    try {
      const response = await axios.get(`${url}?apikey=${apikey}&s=${search}`);
      if (response.data.Response === 'True') {
        setData(response.data.Search);
      } else {
        setData([]);
        setError('No se encontraron resultados.');
      }
    } catch (err) {
      setError('Error al realizar la búsqueda.', err);
    }
    setLoading(false);
  };

  // https://www.omdbapi.com/?apikey=af0dd161&s=batman&i=tt0372784

  const fetchDetails = async (imdbID) => {
    try {
      const response = await axios.get(`${url}?apikey=${apikey}&i=${imdbID}&plot=full`);
      if (response.data.Response === 'True') {
        setSelectedMovie(response.data);
      }
    } catch (err) {
      console.log('Error al obtener detalles:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🎬 Buscador de Películas (OMDb API)</h1>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50 me-2"
          placeholder="🔍 Ingresa el nombre de la película..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      {/* Estado de carga o error */}
      {loading && <p className="text-center">🔄 Buscando resultados...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Resultados */}
      {data.length > 0 && (
        <div>
          <h2 className="text-center">🔎 Resultados:</h2>
          <div className="row">
            {data.map((movie) => (
              <div className="col-md-4 mb-4" key={movie.imdbID}>
                <div className="card h-100">
                  {movie.Poster !== 'N/A' ? (
                    <img
                      src={movie.Poster}
                      className="card-img-top"
                      alt={movie.Title}
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="card-img-top bg-secondary text-white d-flex justify-content-center align-items-center"
                      style={{ height: '400px' }}
                    >
                      No Imagen
                    </div>
                  )}
                  <div className="card-body text-center">
                    <h5 className="card-title">{movie.Title}</h5>
                    <p className="card-text">📅 Año: {movie.Year}</p>
                    <button
                      className="btn btn-outline-info"
                      onClick={() => fetchDetails(movie.imdbID)}
                    >
                      Ver más detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalles de la película */}
      {selectedMovie && (
        <div className="card mt-5">
          <div className="row g-0">
            <div className="col-md-4">
              {selectedMovie.Poster !== 'N/A' && (
                <img
                  src={selectedMovie.Poster}
                  className="img-fluid rounded-start"
                  alt={selectedMovie.Title}
                />
              )}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h2 className="card-title">
                  {selectedMovie.Title} ({selectedMovie.Year})
                </h2>
                <p className="card-text">
                  <strong>📜 Sinopsis:</strong> {selectedMovie.Plot}
                </p>
                <p className="card-text">
                  <strong>🎭 Géneros:</strong> {selectedMovie.Genre}
                </p>
                <p className="card-text">
                  <strong>⏱️ Duración:</strong> {selectedMovie.Runtime}
                </p>
                <p className="card-text">
                  <strong>⭐ Calificación:</strong> {selectedMovie.imdbRating}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
