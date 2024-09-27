import { useEffect, useState } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';

import SearchBar from './components/SearchBar';
import DisplayInfo from './components/DisplayInfo';
import Favorites from './components/Favorites';

function App() {
  const [results, setResults] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sparar Darkmode i localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  // Togglar mellan darkMode och lightMode
  function handleToggleDarkMode() {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }

  // Lägger till om inte Ordet redans finns
  function handleAddToFavorites(word: string) {
    if (!favorites.some((fav) => fav === word)) {
      setFavorites((prevFavorites) => [...prevFavorites, word]);
    }
  }

  // Tar bort om ordet finns
  function handleRemoveFavorites(word: string) {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav !== word)
    );
  }

  // Fetch funktion som körs vartenda gång du har skrivit något i <SearchBar/>
  async function handleSearch(word: string) {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No definitions found for "${word}".`);
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      }
      const data = await response.json();
      setResults(data);
      console.log(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='min-h-screen bg-white text-black dark:bg-modeDark dark:text-white'>
        <section className='w-full relative h-full p-[16px] sm:p-[64px] flex flex-col items-center gap-[64px]'>
          <header className='flex flex-col gap-4 items-center'>
            <h1 className='text-h2'>Dictionary Search</h1>
            <SearchBar onSearch={handleSearch} setError={setError} />
          </header>
          <button
            onClick={handleToggleDarkMode}
            className='absolute flex top-2 right-2 bg-grey05 dark:bg-slate-800 justify-center items-center rounded-full h-[48px] w-[48px] shadow-lg'
            aria-label='Toggle dark mode'
          >
            {darkMode ? (
              <IoMoon color='#ededeb' size={32} />
            ) : (
              <IoSunny color='#fce103' size={32} />
            )}
          </button>

          <Favorites
            favorites={favorites}
            removeFavorites={handleRemoveFavorites}
            onSearch={handleSearch}
          />
          {loading && <p className='dark:text-white'>Loading...</p>}
          {error && <p className='text-red-600'>{error}</p>}
          <aside>
            <DisplayInfo
              results={results}
              addFavorites={handleAddToFavorites}
              favorites={favorites}
              onSearch={handleSearch}
            />
          </aside>
        </section>
      </div>
    </>
  );
}

export default App;
