import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchHeroDetails, fetchFilms, fetchStarships } from '../../utils/api';
import HeroGraph from '../HeroGraph/HeroGraph';
import './HeroDetails.css'

const HeroDetails: React.FC = () => {
  const { heroId } = useParams<{ heroId: string }>();
  const [hero, setHero] = useState<any>(null);
  const [films, setFilms] = useState<any[]>([]);
  const [starships, setStarships] = useState<any[]>([]);

  useEffect(() => {
    const getHeroDetails = async () => {
      const heroData = await fetchHeroDetails(heroId!);
      setHero(heroData);

      const filmsData = await fetchFilms(heroData.films);
      setFilms(filmsData);

      const starshipsData = await fetchStarships(heroData.starships);
      setStarships(starshipsData);
    };
    getHeroDetails();
  }, [heroId]);

  if (!hero) return <div>Loading...</div>;

  return (
    <div>
      <div className='hero-name_container'>
        <h1 className='hero-name'>{hero.name}</h1>
        <Link to={'/'} className='back-button'> Back to List </Link>
      </div>
      <HeroGraph hero={hero} films={films} starships={starships} />
    </div>
  );
};

export default HeroDetails;
