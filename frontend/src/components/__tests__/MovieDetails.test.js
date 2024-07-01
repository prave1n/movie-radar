import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import MovieDetails from '../MovieDetails';

jest.mock('../NavBar', () => () => <div data-testid="navbar">NavBar</div>);

jest.mock('../ReviewCard', () => ({ review, onUpvote, onRemoveUpvote, onDelete }) => (
    <div data-testid="review-card">
      {review ? (
        <>
          <p>{review.reviewText}</p>
          <button onClick={() => onUpvote(review._id)}>Upvote</button>
          <button onClick={() => onRemoveUpvote(review._id)}>Remove Upvote</button>
          <button onClick={() => onDelete(review._id)}>Delete</button>
        </>
      ) : (
        <p>No review data</p>
      )}
    </div>
  ));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
);

const mockStore = configureStore([]);

describe('MovieDetails Component', () => {
  let store;
  const initialState = {
    user: {
      email: 'test@example.com',
      userid: '123',
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    fetch.mockClear();
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

  test('renders MovieDetails component with movie information', async () => {
    const mockMovie = {
      title: 'Test Movie',
      overview: 'Test Overview',
      release_date: '2023-01-01',
      picture: 'test.jpg',
    };

    fetch.mockImplementation((url) => {
      if (url.includes('/movie/1')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockMovie),
          ok: true,
        });
      } else if (url.includes('/reviews/1')) {
        return Promise.resolve({
          json: () => Promise.resolve([]),
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

    renderComponent();

    await waitFor(() => {
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByText('Test Overview')).toBeInTheDocument();
        expect(screen.getByText('Release Date: 2023-01-01')).toBeInTheDocument();
        expect(screen.getByText(/Average Rating:/)).toBeInTheDocument();
      });
  });

  test('submits a new review', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Review/i), { target: { value: 'Great movie!' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/review',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            user: 'test@example.com',
            movie: '1',
            rating: '4',
            reviewText: 'Great movie!',
          }),
        })
      );
    });
  });

  test('deletes a review', async () => {
    const mockReviews = [
      { _id: '1', user: { _id: '123' }, reviewText: 'Test review', upvotes: 0 },
    ];

    fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockReviews),
          ok: true,
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}), ok: true });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test review')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/review/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  test('upvotes a review', async () => {
    const mockReviews = [
      { _id: '1', user: { _id: '456' }, reviewText: 'Test review', upvotes: 0 },
    ];

    fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockReviews),
          ok: true,
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}), ok: true });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test review')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Upvote'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/review/upvote/1',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ userId: 'test@example.com' }),
        })
      );
    });
  });

  test('removes upvote from a review', async () => {
    const mockReviews = [
      { _id: '1', user: { _id: '456' }, reviewText: 'Test review', upvotes: 1 },
    ];

    fetch.mockImplementation((url) => {
      if (url.includes('/reviews/1')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockReviews),
          ok: true,
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}), ok: true });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test review')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remove Upvote'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/review/remove-upvote/1',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ userId: 'test@example.com' }),
        })
      );
    });
  });
});

//src/components/__tests__/MovieDetails.test.js