import { WordEntry } from '../types';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

const colors = [
  'text-blue-600 bg-blue-400/50 dark:text-blue-200 dark:bg-blue-500/50',
  'text-green-600 bg-green-400/50 dark:text-green-200 dark:bg-green-500/50',
  'text-yellow-600 bg-yellow-400/50 dark:text-yellow-200 dark:bg-yellow-500/50',
  'text-purple-600 bg-purple-400/50 dark:text-purple-200 dark:bg-purple-500/50',
  'text-red-600 bg-red-400/50 dark:text-red-200 dark:bg-red-500/50',
];

type DisplayInfoProps = {
  results: WordEntry[];
  onSearch: (word: string) => void;
  addFavorites: (word: string) => void;
  favorites: string[];
};

export default function DisplayInfo({
  results,
  onSearch,
  addFavorites,
  favorites,
}: DisplayInfoProps) {
  const firstEntry = results[0];

  function checkFavorites(word: string): boolean {
    return favorites.includes(word);
  }

  if (results.length === 0) {
    return null;
  }

  // hittar första audio/mp3
  const firstValidPhoneticAudio = firstEntry.phonetics.find(
    (phonetic) => phonetic.audio && phonetic.audio.trim() !== ''
  );

  // Hittar första Phoentic text
  const firstValidPhoneticText = firstEntry.phonetics.find(
    (phonetic) => phonetic.text && phonetic.text.trim() !== ''
  );

  const firstPhonetic = firstEntry.phonetics[0];

  return (
    <>
      <section className='flex gap-5 flex-col bg-grey05 dark:bg-slate-800 md:max-w-[600px] p-[16px] h-fit rounded-3xl shadow-lg'>
        <div className='flex flex-col'>
          <aside className='flex justify-between'>
            <h2 className='text-h3 font-medium text-blue-400 cursor-default'>
              {firstEntry.word}
            </h2>
            <button
              className='flex w-fit h-fit'
              onClick={() => addFavorites(firstEntry.word)}
              aria-label={
                checkFavorites(firstEntry.word)
                  ? `Remove ${firstEntry.word} from favorites`
                  : `Add ${firstEntry.word} to favorites`
              }
            >
              {checkFavorites(firstEntry.word) ? (
                <IoMdHeart size={32} color='red' />
              ) : (
                <IoMdHeartEmpty size={32} color='red' />
              )}
            </button>
          </aside>

          {firstPhonetic && (
            <div className='flex flex-col gap-4'>
              {firstValidPhoneticText && (
                <p className='text-bodyDefault'>
                  <strong>{firstValidPhoneticText.text}</strong>
                </p>
              )}

              {firstValidPhoneticAudio && (
                <audio
                  controls
                  src={firstValidPhoneticAudio.audio}
                  data-testid='audio-element'
                >
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
        </div>
        <aside className='flex flex-col gap-4'>
          {firstEntry.meanings.map((meaning, mIndex) => (
            <div key={mIndex}>
              <h3
                className={`${
                  colors[mIndex % colors.length]
                } px-3 text-[18px] py-1 w-fit h-fit rounded-[10px]`}
              >
                {meaning.partOfSpeech}
              </h3>

              {meaning.definitions.length > 0 && (
                <div className='flex flex-col gap-2'>
                  {meaning.definitions.slice(0, 1).map((def, dIndex) => (
                    <div key={dIndex} className='flex flex-col gap-2'>
                      <p>
                        <span>Definition:</span> {def.definition}
                      </p>

                      {def.example && (
                        <p>
                          <span> Example:</span> {def.example}
                        </p>
                      )}
                    </div>
                  ))}
                  {meaning.synonyms.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      <span>Synonyms:</span>
                      {meaning.synonyms.map((syn, sIndex) => (
                        <p
                          key={sIndex}
                          className={`${
                            colors[mIndex % colors.length]
                          } px-[6px] rounded-lg cursor-pointer`}
                          onClick={() => onSearch(syn)}
                        >
                          {syn}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <aside className='flex flex-col'>
            {firstEntry.sourceUrls.map((url, uIndex) => (
              <a
                href={url}
                key={uIndex}
                className='text-blue-500 underline hover:text-blue-700'
              >
                {url}
              </a>
            ))}
          </aside>
        </aside>
      </section>
    </>
  );
}
