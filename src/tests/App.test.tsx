import { render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import { describe, expect, test } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import '../setupTests'; // Ensure MSW is set up here

describe('App Component', () => {
  test('renders search bar and favorites container', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    expect(searchInput).toBeInTheDocument();

    const favoritesHeader = screen.getByText('Favorites');
    expect(favoritesHeader).toBeInTheDocument();
  });

  test('displays error message for a non-existent word', async () => {
    render(<App />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    await user.type(searchInput, 'nonexistentword{Enter}');

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/no definitions found/i)).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('toggles dark mode correctly', async () => {
    render(<App />);
    const user = userEvent.setup();

    const toggleDarkModeButton = screen.getByLabelText('Toggle dark mode');
    expect(toggleDarkModeButton).toBeInTheDocument();

    await user.click(toggleDarkModeButton);
    expect(document.documentElement).toHaveClass('dark');

    await user.click(toggleDarkModeButton);
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('displays error message when search input is empty', async () => {
    render(<App />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    await user.clear(searchInput);
    await user.keyboard('{Enter}');

    expect(screen.getByText('Please enter a "Word"')).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText(/no definitions found/i)).not.toBeInTheDocument();
  });

  test('adds a word to favorites', async () => {
    render(<App />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    await user.type(searchInput, 'hello{Enter}');

    const definition = await screen.findByText(
      /"Hello!" or an equivalent greeting./i
    );
    expect(definition).toBeInTheDocument();

    const addToFavoritesButton = screen.getByRole('button', {
      name: /add hello to favorites/i,
    });
    expect(addToFavoritesButton).toBeInTheDocument();

    await user.click(addToFavoritesButton);

    const favoritesHeader = screen.getByText('Favorites');
    const favoritesSection = favoritesHeader.closest('section');
    expect(favoritesSection).toBeInTheDocument();

    if (favoritesSection) {
      const withinFavorites = within(favoritesSection);
      const favoriteItem = withinFavorites.getByText('hello');
      expect(favoriteItem).toBeInTheDocument();
    }
  });

  test('removes a word from favorites', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Add "hello" to favorites first
    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    await user.type(searchInput, 'hello{Enter}');

    await screen.findByText(/"Hello!" or an equivalent greeting./i);

    const addToFavoritesButton = screen.getByRole('button', {
      name: /add hello to favorites/i,
    });
    await user.click(addToFavoritesButton);

    // Now remove it from favorites
    const favoritesHeader = screen.getByText('Favorites');
    const favoritesSection = favoritesHeader.closest('section');

    if (favoritesSection) {
      const withinFavorites = within(favoritesSection);
      const removeButton = withinFavorites.getByRole('button', {
        name: /remove hello from favorites/i,
      });
      expect(removeButton).toBeInTheDocument();

      await user.click(removeButton);

      expect(withinFavorites.queryByText('hello')).not.toBeInTheDocument();
    }
  });

  test('does not add duplicate words to favorites', async () => {
    render(<App />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    await user.type(searchInput, 'hello{Enter}');

    await screen.findByText(/"Hello!" or an equivalent greeting./i);

    const addToFavoritesButton = screen.getByRole('button', {
      name: /add hello to favorites/i,
    });
    await user.click(addToFavoritesButton);
    await user.click(addToFavoritesButton); // Attempt to add duplicate

    const favoritesHeader = screen.getByText('Favorites');
    const favoritesSection = favoritesHeader.closest('section');

    if (favoritesSection) {
      const withinFavorites = within(favoritesSection);
      const favoriteItems = withinFavorites.getAllByText('hello');
      expect(favoriteItems).toHaveLength(1);
    }
  });

  test('favorites persist after re-rendering', async () => {
    const { unmount } = render(<App />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    await user.type(searchInput, 'hello{Enter}');
    await screen.findByText(/"Hello!" or an equivalent greeting./i);

    const addToFavoritesButton = screen.getByRole('button', {
      name: /add hello to favorites/i,
    });
    await user.click(addToFavoritesButton);

    unmount();
    render(<App />);

    const favoritesHeader = screen.getByText('Favorites');
    const favoritesSection = favoritesHeader.closest('section');

    if (favoritesSection) {
      const withinFavorites = within(favoritesSection);
      const favoriteItem = withinFavorites.getByText('hello');
      expect(favoriteItem).toBeInTheDocument();
    }
  });
  test('renders audio element and allows user interaction', async () => {
    render(<App />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for Word.../i);
    await user.type(searchInput, 'hello{Enter}');

    const definition = await screen.findByText(
      /"Hello!" or an equivalent greeting./i
    );
    expect(definition).toBeInTheDocument();

    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    expect(audioElement).toBeInTheDocument();

    expect(audioElement).toHaveAttribute(
      'src',
      'https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3'
    );

    audioElement.focus();
    await user.keyboard('{Enter}');
  });
  test('searches for a word when clicked in favorites', async () => {
    render(<App />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for word.../i);
    await user.type(searchInput, 'hello{Enter}');
    await screen.findByText(/"Hello!" or an equivalent greeting./i);
    const addToFavoritesButton = screen.getByRole('button', {
      name: /add hello to favorites/i,
    });
    await user.click(addToFavoritesButton);

    const favoritesHeader = screen.getByText('Favorites');
    const favoritesSection = favoritesHeader.closest('section');

    if (favoritesSection) {
      const withinFavorites = within(favoritesSection);
      const favoriteWord = withinFavorites.getByText('hello');
      expect(favoriteWord).toBeInTheDocument();

      await user.click(favoriteWord);
    }

    await screen.findByText(/"Hello!" or an equivalent greeting./i);

    expect(searchInput).toHaveValue('hello');
  });
});
