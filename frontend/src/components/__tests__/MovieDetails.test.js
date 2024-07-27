import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MovieDetails from '../MovieDetails';

// Mock the NavBar component
jest.mock('../NavBar', () => () => <div data-testid="navbar">NavBar</div>);

// Mock the ReviewCard component
jest.mock('../ReviewCard', () => ({ review, onUpvote, onRemoveUpvote, onDelete, canDelete }) => (
  <div data-testid="review-card">
    <p>{review.reviewText}</p>
    <button onClick={() => onUpvote(review._id)}>Upvote</button>
    <button onClick={() => onRemoveUpvote(review._id)}>Remove Upvote</button>
    {canDelete && <button onClick={() => onDelete(review._id)}>Delete</button>}
  </div>
));

const mockStore = configureStore([]);

const mockMovie = {
  id: '1',
  title: 'Test Movie',
  overview: 'This is a test movie',
  release_date: '2023-01-01',
  picture: 'https://example.com/movie.jpg',
};

const mockReviews = [
  { _id: '1', user: { _id: 'user1' }, reviewText: 'Great movie!', rating: 4, upvotes: 1, isUpvoted: false },
  { _id: '2', user: { _id: 'user2' }, reviewText: 'Awesome!', rating: 5, upvotes: 2, isUpvoted: true },
];

describe('MovieDetails Component', () => {
  let store;

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('/movie/1')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockMovie),
          ok: true,
        });
      } else if (url.includes('/reviews/1')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockReviews),
          ok: true,
        });
      } else if (url.includes('/average-rating')) {
        return Promise.resolve({
          json: () => Promise.resolve({ averageRating: 4.5 }),
          ok: true,
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}), ok: true });
    });
  
    store = mockStore({
      user: {
        email: 'test@example.com',
        userid: 'user1',
      },
    });
  
    jest.clearAllMocks();
  });
  

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/movie/1']}>
          <Routes>
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders MovieDetails component', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/movie/1')) {
        return Promise.resolve({ json: () => Promise.resolve(mockMovie) });
      } else if (url.includes('/reviews/1')) {
        return Promise.resolve({ json: () => Promise.resolve(mockReviews) });
      } else if (url.includes('/average-rating')) {
        return Promise.resolve({ json: () => Promise.resolve({ averageRating: 4.5 }) });
      }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('This is a test movie')).toBeInTheDocument();
      expect(screen.getByText('Release Date: 2023-01-01')).toBeInTheDocument();
      expect(screen.getByText(/Average Rating:/)).toBeInTheDocument();
    });
  });

  test('handles movie fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch movie'));

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
    });
  });

  test('renders review form', () => {
    renderComponent();

    expect(screen.getByLabelText('Your Review')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Review' })).toBeInTheDocument();
  });

  test('submits a review successfully', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Your Review'), { target: { value: 'Great movie!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Review' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/review', expect.any(Object));
    });
  });

  test('handles review submission error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to submit review'));

    renderComponent();

    fireEvent.change(screen.getByLabelText('Your Review'), { target: { value: 'Great movie!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Review' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/review', expect.any(Object));
    });
  });

  test('renders reviews', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({ json: () => Promise.resolve(mockReviews) });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Great movie!')).toBeInTheDocument();
      expect(screen.getByText('Awesome!')).toBeInTheDocument();
    });
  });

  test('handles upvote', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({ json: () => Promise.resolve(mockReviews) });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Upvote')[0]);
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/review/upvote/1', expect.any(Object));
  });

  test('handles remove upvote', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({ json: () => Promise.resolve(mockReviews) });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Remove Upvote')[0]);
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/review/remove-upvote/1', expect.any(Object));
  });

  test('handles delete review', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({ json: () => Promise.resolve(mockReviews) });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    renderComponent();

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/review/1', expect.any(Object));
  });

  test('displays no reviews message', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({ json: () => Promise.resolve([]) });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No reviews yet. If you have watched this movie, please add a review!')).toBeInTheDocument();
    });
  });
});
