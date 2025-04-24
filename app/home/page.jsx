"use client"; 

import { useEffect, useState } from "react";
import axios from "axios"; 
import CharacterCard from "../../components/CharacterCard";
import styles from "./Home.module.css";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import Loader from "../../components/Loader";

export default function Home() {
  const [search, setSearch] = useState(""); 
  const [characters, setCharacters] = useState([]); 
  const [notFound, setNotFound] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCharacters = async (name, pageNumber) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
      setCharacters(data.results);
      setTotalPages(data.info.pages);
      setNotFound(false);
  } catch {
      setCharacters([]);
      setNotFound(true);
  } finally {
      setLoading(false);
  }

  try {
    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
    setCharacters(data.results);
    setTotalPages(data.info.pages);
    setNotFound(false);
} catch {
    setCharacters([]);
    setNotFound(true);
}
};

  useEffect(() => {
    fetchCharacters(search.trim(), page); 
  }, [page]);
  
  useEffect(() => {
    fetchCharacters(search, page); 
  }, [search]);

  const handleSearch = () => {
    const name = search.trim();
    setPage(1);
    fetchCharacters(name, 1);
  };

  const handleReset = () => {
    setSearch("");
    setPage(1);
    fetchCharacters("", 1);
    toast.success("Filtro foi resetado", { position: "top-left" });
  };

  const handleCardClick = (name) => {
    toast.info(`Você clicou em ${name}`);
  };

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-right" 
        autoClose={7500} 
        theme="light" 
      />

      <h1 className={styles.title}>Personagens de Rick and Morty</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Buscar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        <button
          onClick={handleSearch} className={styles.buttonSearch}>
          Buscar
        </button>
        <button onClick={handleReset} className={styles.buttonReset}>
          Resetar
        </button>
      </div>

      {/* Navegação de páginas */}
      <div className={styles.navControls}>
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || notFound} className={styles.buttonNav}>
                    Página Anterior
                </button>

                {/* Indicador de página */}
                <span className={styles.pageIndicator}>
                    Página {page} de {totalPages}
                </span>

                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages || notFound} className={styles.buttonNav}>
                    Próxima Página
                </button>

                {notFound && (
                <h1 className={styles.notFound}>Nenhum personagem encontrado 😢</h1>
          )}
            </div>

            {loading ? (
                    <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                        <Loader />
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {characters.map((char) => (
                            <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char)} />
                        ))}
                    </div>
                )}

<div className={styles.grid}>
    {characters.map((char) => (
        <CharacterCard
            key={char.id}
            character={char}
            onClick={() => handleCardClick(char.name)}
        />
    ))}
</div>
        </div>
    )
}
