
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';

jest.mock('../MovieCard', () => ({ movie, title, overview, picture }) => (
  <div data-testid="movie-card">
    <h3>{title}</h3>
    <p>{overview}</p>
  </div>
));
jest.mock('../WatchList', () => () => <div data-testid="watch-list">WatchList</div>);
jest.mock('../SearchBar', () => ({ setSearch }) => (
  <input
    data-testid="search-bar"
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search movies"
  />
));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders Home component', async () => {
    render(<Home />);
    
    expect(screen.getByText('Movie List')).toBeInTheDocument();
    expect(screen.getByText('(Credits: Movie data taken from themoviedb)')).toBeInTheDocument();
    expect(screen.getByTestId('watch-list')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Genre:')).toBeInTheDocument();
    
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  test('fetches movies on component mount', async () => {
    render(<Home />);
    
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith('https://movie-radar-2.onrender.com/movie', expect.any(Object));
  });

  test('filters movies based on search input', async () => {
    const mockMovies = [
      { id: 1, title: 'Test Movie 1', overview: 'Overview 1', genre_ids: [28] },
      { id: 2, title: 'Another Movie', overview: 'Overview 2', genre_ids: [35] },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMovies),
      })
    );

    render(<Home />);

    await waitFor(() => expect(screen.getAllByTestId('movie-card')).toHaveLength(2));

    const searchInput = screen.getByTestId('search-bar');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    expect(screen.getAllByTestId('movie-card')).toHaveLength(1);
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
  });

  test('filters movies based on genre selection', async () => {
    const mockMovies = [
      { id: 1, title: 'Action Movie', overview: 'Action Overview', genre_ids: [28] },
      { id: 2, title: 'Comedy Movie', overview: 'Comedy Overview', genre_ids: [35] },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMovies),
      })
    );

    render(<Home />);

    await waitFor(() => expect(screen.getAllByTestId('movie-card')).toHaveLength(2));

    const genreSelect = screen.getByLabelText('Filter by Genre:');
    fireEvent.change(genreSelect, { target: { value: '28' } });

    expect(screen.getAllByTestId('movie-card')).toHaveLength(1);
    expect(screen.getByText('Action Movie')).toBeInTheDocument();
  });
});