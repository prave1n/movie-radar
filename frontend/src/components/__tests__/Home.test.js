import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Home';

// Mock the child components
jest.mock('../MovieCard', () => ({ movie }) => <div data-testid="movie-card">{movie.title}</div>);
jest.mock('../MovieSearchBar', () => ({ setSearch }) => (
  <input data-testid="search-bar" onChange={(e) => setSearch(e.target.value)} />
));
jest.mock('../NavBar', () => () => <div>NavBar</div>);
jest.mock('../Pagination', () => ({ currentPage, totalPages, onPageChange }) => (
  <div data-testid="pagination">
    <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
    <span>{currentPage} of {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
  </div>
));
jest.mock('../Footer', () => () => <div>Footer</div>);

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ movies: [], totalPages: 1 }),
  })
);

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders without crashing', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Browse Movies')).toBeTruthy();
    });
  });

  it('fetches movies on initial render', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  it('updates search and fetches movies', async () => {
    render(<Home />);
    await waitFor(() => {

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  
    const searchBar = screen.getByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'test movie' } });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(4);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('search=test+movie'),
        expect.any(Object)
      );
    });
  });

  it('toggles genre filter', async () => {
    render(<Home />);
    const genreToggle = screen.getByLabelText('toggle genres filter');
    fireEvent.click(genreToggle);
    expect(screen.getByText('Action')).toBeTruthy();
  });

  it('toggles year range filter', async () => {
    render(<Home />);
    const yearToggle = screen.getByLabelText('toggle release year filter');
    fireEvent.click(yearToggle);
    expect(screen.getByText('Before 1980')).toBeTruthy();
  });

  it('toggles sort options', async () => {
    render(<Home />);
    const sortToggle = screen.getByLabelText('toggle sort options');
    fireEvent.click(sortToggle);
    
    await waitFor(() => {
      const sortSelect = screen.getByLabelText('Sort by Release Date');
      expect(sortSelect).toBeTruthy();
      
      fireEvent.mouseDown(sortSelect);
      
      const mostRecentOption = screen.getByRole('option', { name: 'Most Recent' });
      expect(mostRecentOption).toBeTruthy();
    });
  });

  it('changes page', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ movies: [], totalPages: 2 }),
      })
    );
    render(<Home />);
    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
    });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });
  });

  it('renders movie cards', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          movies: [{ _id: '1', title: 'Test Movie' }],
          totalPages: 1
        }),
      })
    );
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeTruthy();
    });
  });
});


