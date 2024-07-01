import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WatchList from '../WatchList';

jest.mock('../NavBar', () => () => <div data-testid="navbar">NavBar</div>);

global.fetch = jest.fn();

const mockStore = configureStore([]);

describe('WatchList Component', () => {
  let store;
  const initialState = {
    user: {
      fname: 'John',
      userid: '123',
      watchlist: [
        { name: 'Movie 1', picture: 'movie1.jpg' },
        { name: 'Movie 2', picture: 'movie2.jpg' },
      ],
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    fetch.mockClear();
  });

  test('renders WatchList component with user\'s name and movies', () => {
    render(
      <Provider store={store}>
        <WatchList />
      </Provider>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText("John's WatchList")).toBeInTheDocument();
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
  });

  test('deletes movie from watchlist when delete button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ message: 'Movie deleted successfully' }),
    });

    render(
      <Provider store={store}>
        <WatchList />
      </Provider>
    );

    const deleteButtons = screen.getAllByText('Delete from watchlist');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/deleteMovie',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            id: '123',
            movie: { name: 'Movie 1', picture: 'movie1.jpg' },
          }),
        })
      );
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe('user/removemovie');
    expect(actions[0].payload).toEqual([{ name: 'Movie 2', picture: 'movie2.jpg' }]);
  });

  test('handles error when deleting movie fails', async () => {
    console.log = jest.fn();
    fetch.mockRejectedValueOnce(new Error('Failed to delete movie'));

    render(
      <Provider store={store}>
        <WatchList />
      </Provider>
    );

    const deleteButtons = screen.getAllByText('Delete from watchlist');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});

//src/components/__tests__/Watchlist.test.js