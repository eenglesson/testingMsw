import React, { useRef, useState } from 'react';

import { FiSearch } from 'react-icons/fi';

type SearchBarProps = {
  onSearch: (word: string) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({ onSearch, setError }: SearchBarProps) {
  const [searchText, setSearchText] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchText.trim() !== '') {
      onSearch(searchText.trim());
      inputRef.current?.blur();
    } else {
      setError('Please enter a "Word"');
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='flex w-[364px] items-center dark:bg-slate-800 shadow-lg bg-grey05 h-[52px] gap-3 pl-[24px] rounded-full'>
          <FiSearch size={24} />
          <input
            ref={inputRef}
            type='text'
            placeholder='Search for Word...'
            className='flex bg-transparent w-full text-[14px] text-black font-medium rounded-[16px] h-full outline-none placeholder:text-slate-400 placeholder:dark:text-slate-400 dark:text-white'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </form>
    </>
  );
}
