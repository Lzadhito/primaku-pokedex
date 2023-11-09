import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface RawPokemon {
  id: string;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}
export default function Home() {
  const [data, setData] = useState<RawPokemon[]>([]);
  const [offset, setOffset] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    async function fetchAll() {
      const rawAllPoke = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const allPokes = await rawAllPoke.json();
      const pokePromises = allPokes?.results?.map((poke: { url: string }) =>
        fetch(poke.url).then((resp) => resp.json())
      );
      const resp = await Promise.all(pokePromises);
      setData((prev) => [...prev, ...resp]);
    }

    fetchAll();
  }, [offset]);

  useEffect(() => {
    setOffset((prev) => prev + 20);
  }, [inView]);

  return (
    <div className="min-h-screen">
      <header className="h-14 w-full bg-red-500 flex items-center px-4">
        <h1 className="text-xl font-bold">Pokedex</h1>
      </header>
      <section className="grid grid-cols-2 gap-4 p-2">
        {data?.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name}
            image={pokemon.sprites.front_default}
            type={pokemon.types[0].type.name}
          />
        ))}
        {data?.length > 1 && <div ref={ref} />}
      </section>
    </div>
  );
}

// Should be another file ===
const POKEMON_TYPE_COLOR = {
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  bug: 'bg-yellow-500',
};

interface PokemonCard {
  name: string;
  image: string;
  type: string;
}

function PokemonCard({ name, image, type }: PokemonCard) {
  const bgColor = POKEMON_TYPE_COLOR[type as keyof typeof POKEMON_TYPE_COLOR] ?? 'bg-stone-500';

  return (
    <div className={`${bgColor} bg- shadow-xl flex flex-col items-center justify-center h-48 p-8 rounded-xl`}>
      <figure>
        <img src={image} alt="pokemonImage" />
      </figure>
      <div className="text-center">
        <p>{name}</p>
      </div>
    </div>
  );
}
