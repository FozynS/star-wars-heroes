import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import './HeroGraph.css';

interface HeroGraphProps {
  hero: any;
  films: any[];
  starships: any[];
}

const HeroGraph: React.FC<HeroGraphProps> = ({ hero, films, starships }) => {
  const nodes = useMemo(() => {
    const heroNode: Node = {
      id: hero.id,
      data: { label: hero.name },
      position: { x: 250, y: 20 },
      style: { 
        textAlign: 'center',
        background: '#e9c46a', 
        color: '#000', 
        padding: 10, 
        borderRadius: 5,
        border: '2px solid #f4a261',
        fontFamily: 'Star Jedi',
      },
    };

    const filmNodes = films.map((film, index) => ({
      id: `film-${index}`,
      data: { label: film.title },
      position: { x: 0, y: (index + 1) * 100 },
      style: { 
        background: '#2a9d8f', 
        color: '#fff', 
        padding: 10, 
        borderRadius: 5,
        border: '2px solid #264653',
        fontFamily: 'Star Jedi',
      },
    }));

    const starshipNodes = starships.map((starship, index) => ({
      id: `starship-${index}`,
      data: { label: starship.name },
      position: { x: 500, y: (index + 1) * 100 },
      style: { 
        background: '#e76f51', 
        color: '#fff', 
        padding: 10, 
        borderRadius: 5,
        border: '2px solid #d62839',
        fontFamily: 'Star Jedi',
      },
    }));

    return [heroNode, ...filmNodes, ...starshipNodes];
  }, [hero, films, starships]);

  const edges = useMemo(() => {
    const filmEdges = films.map((_, index) => ({
      id: `edge-hero-film-${index}`,
      source: hero.id,
      target: `film-${index}`,
      animated: true,
      style: { stroke: '#f4a261' },
    }));

    const starshipEdges = starships.map((_, index) => ({
      id: `edge-film-starship-${index}`,
      source: `film-${index}`,
      target: `starship-${index}`,
      animated: true,
      style: { stroke: '#e76f51' },
    }));

    return [...filmEdges, ...starshipEdges];
  }, [hero, films, starships]);

  return (
    <div className="graph-container">
      <ReactFlow nodes={nodes} edges={edges}>
        <MiniMap 
          nodeColor={(n) => {
            if (n.id === hero.id) return '#e9c46a';
            if (n.id.startsWith('film-')) return '#2a9d8f';
            if (n.id.startsWith('starship-')) return '#e76f51';
            return '#fff';
          }}
        />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default HeroGraph;
