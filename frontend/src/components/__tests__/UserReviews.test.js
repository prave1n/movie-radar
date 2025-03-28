import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserReviews from '../UserReviews';

global.fetch = jest.fn();

jest.mock('../NavBar', () => () => <div data-testid="navbar">NavBar</div>);

jest.mock('../UserReviewCard', () => ({ review, onUpvote, onRemoveUpvote, onDelete }) => (
  <div data-testid="user-review-card">
    <h2>{review.movie.title}</h2>
    <p>Rating: {review.rating}/5</p>
    <p>{review.content}</p>
    <button onClick={() => onUpvote(review._id)}>Upvote</button>
    <button onClick={() => onRemoveUpvote(review._id)}>Remove Upvote</button>
    <button onClick={() => onDelete(review._id)}>Delete</button>
  </div>
));

const mockStore = configureStore([]);

describe('UserReviews Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        email: 'test@example.com',
        userid: '123'
      }
    });
    fetch.mockClear();
  });

  test('renders NavBar and "Your Reviews" heading', () => {
    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Your Reviews')).toBeInTheDocument();
  });

  test('displays "No reviews found" when there are no reviews', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('No reviews found')).toBeInTheDocument();
    });
  });

  test('fetches and displays user reviews', async () => {
    const mockReviews = [
      { _id: '1', content: 'Great movie!', movie: { title: 'Movie 1' }, rating: 4, user: { _id: '123' }, upvotes: 0 },
      { _id: '2', content: 'Not bad', movie: { title: 'Movie 2' }, rating: 3, user: { _id: '456' }, upvotes: 0 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });

    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Movie 2')).toBeInTheDocument();
    });
  });

  test('handles error when fetching reviews fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  test('handles upvote action', async () => {
    const mockReviews = [
      { _id: '1', content: 'Great movie!', movie: { title: 'Movie 1' }, rating: 4, user: { _id: '123' }, upvotes: 0 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });

    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });

    fetch.mockResolvedValueOnce({
      ok: true
    });

    fireEvent.click(screen.getByText('Upvote'));

    await waitFor(() => {
      /* expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/review/upvote/1',
        expect.any(Object)
      ); */
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test('handles remove upvote action', async () => {
    const mockReviews = [
      { _id: '1', content: 'Great movie!', movie: { title: 'Movie 1' }, rating: 4, user: { _id: '123' }, upvotes: 1 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });

    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });

    fetch.mockResolvedValueOnce({
      ok: true
    });

    fireEvent.click(screen.getByText('Remove Upvote'));

    await waitFor(() => {
      /* expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/review/remove-upvote/1',
        expect.any(Object)
      ); */
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test('handles error when upvoting review fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const mockReviews = [
      { _id: '1', content: 'Great movie!', movie: { title: 'Movie 1' }, rating: 4, user: { _id: '123' }, upvotes: 0 }
    ];
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });
  
    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });
  
    fetch.mockRejectedValueOnce(new Error('Failed to upvote'));
  
    fireEvent.click(screen.getByText('Upvote'));
  
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error upvoting review:', expect.any(Error));
    });
  
    consoleError.mockRestore();
  });
  
  test('handles error when removing upvote fails', async () => {

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const mockReviews = [
      { _id: '1', content: 'Great movie!', movie: { title: 'Movie 1' }, rating: 4, user: { _id: '123' }, upvotes: 1 }
    ];
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });
  
    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });

    fetch.mockRejectedValueOnce(new Error('Failed to remove upvote'));
  
    fireEvent.click(screen.getByText('Remove Upvote'));
  
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error removing upvote from review:', expect.any(Error));
    });

    consoleError.mockRestore();
  });    

  test('handles delete review action', async () => {
    const mockReviews = [
      { _id: '1', content: 'Great movie!', movie: { title: 'Movie 1' }, rating: 4, user: { _id: '123' }, upvotes: 0 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });

    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });

    fetch.mockResolvedValueOnce({
      ok: true
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      /* expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/review/1',
        expect.objectContaining({ method: 'DELETE' })
      ); */
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test('handles error when deleting review fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const mockReviews = [
      { _id: '1', content: 'Great movie!', movie: { title: 'Movie 1' }, rating: 4, user: { _id: '123' }, upvotes: 0 }
    ];
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });
  
    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });
  
    fetch.mockRejectedValueOnce(new Error('Failed to delete review'));
  
    fireEvent.click(screen.getByText('Delete'));
  
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error deleting review:', expect.any(Error));
    });
  
    // Clean up mock
    consoleError.mockRestore();
  });
  

  test('does not fetch reviews if email is not available in state', async () => {
    store = mockStore({
      user: {
        email: '',
        userid: '123'
      }
    });
  
    render(
      <Provider store={store}>
        <UserReviews />
      </Provider>
    );
  
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });
  
});