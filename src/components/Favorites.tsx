import { IoMdHeart } from 'react-icons/io';

type FavoritesInfoProps = {
  favorites: string[];
  onSearch: (word: string) => void;
  removeFavorites: (word: string) => void;
};

export default function Favorites({
  favorites,
  onSearch,
  removeFavorites,
}: FavoritesInfoProps) {
  return (
    <>
      <section className='flex flex-col bg-grey05 dark:text-white dark:bg-slate-800 p-4 gap-4 min-w-[364px] shadow-lg rounded-lg'>
        <h2 className='text-h3 underline'>Favorites</h2>
        {favorites.length > 0 ? (
          favorites.map((word, wIndex) => (
            <ul
              key={wIndex}
              className='flex justify-between gap-10 items-center'
            >
              <li
                onClick={() => onSearch(word)}
                className='text-h3 cursor-pointer text-blue-400 font-medium w'
              >
                {word}
              </li>
              <button
                className='cursor-pointer bg-transparent border-none '
                aria-label={`Remove ${word} from favorites`}
                onClick={() => removeFavorites(word)}
              >
                <IoMdHeart size={32} color='red' />
              </button>
            </ul>
          ))
        ) : (
          <p className='text-h4 text-slate-400 dark:text-slate-300'>
            No favorites yet.
          </p>
        )}
      </section>
    </>
  );
}
