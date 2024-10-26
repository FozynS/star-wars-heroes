import React, { useEffect, useState } from "react";

import HeroType from "../../types/HeroType";
import "./HeroList.css";
import { fetchHeroes } from "../../utils/api";
import { Link } from "react-router-dom";

const HeroList: React.FC = () => {
  const [heroes, setHeroes] = useState<HeroType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getHeroes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchHeroes(page);
        setHeroes((prev) => {
          const combinedHeroes = [...prev, ...data.results];
          const uniqueHeroes = Array.from(
            new Set(combinedHeroes.map((hero) => hero.id))
          ).map((id) => combinedHeroes.find((hero) => hero.id === id));
          return uniqueHeroes;
        });
        setHasMore(data.next !== null);
      } catch (err) {
        setError("Failed to load heroes.");
      } finally {
        setIsLoading(false);
      }
    };

    getHeroes();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (
        scrollY + windowHeight >= documentHeight - 50 &&
        hasMore &&
        !isLoading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isLoading]);

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Star Wars Heroes</h1>
      </header>

      <div className="hero-list">
        {heroes.map((hero: HeroType) => (
          <div key={hero.id} className="hero-card">
            <Link to={`/hero/${hero.id}`} className="link">
              <img
                src={`https://starwars-visualguide.com/assets/img/characters/${hero.id}.jpg`}
                alt={hero.name}
                className="hero-image"
              />
              <div className="hero-info">
                <h3>{hero.name}</h3>
              </div>
            </Link>
          </div>
        ))}
        {isLoading && <div className="loading">Loading more heroes...</div>}
      </div>
    </div>
  );
};

export default HeroList;
