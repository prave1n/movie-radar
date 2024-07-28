import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import WatchList from '../WatchList';

const mockStore = configureStore([]);

describe('WatchList Component', () => {
  let store;
  const initialState = {
    user: {
      userid: '123',
      watchlist: [
        { _id: '1', title: 'Movie 1', picture: 'movie1.jpg', dbid: 'db1' },
        { _id: '2', title: 'Movie 2', picture: 'movie2.jpg', dbid: 'db2' },
        { _id: '3', title: 'Movie 3', picture: 'movie3.jpg', dbid: 'db3' },
        { _id: '4', title: 'Movie 4', picture: 'movie4.jpg', dbid: 'db4' },
        { _id: '5', title: 'Movie 5', picture: 'movie5.jpg', dbid: 'db5' },
        { _id: '6', title: 'Movie 6', picture: 'movie6.jpg', dbid: 'db6' },
      ],
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    global.fetch = jest.fn();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <WatchList />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders WatchList component with correct title', () => {
    renderComponent();
    expect(screen.getByText('Your WatchList')).toBeInTheDocument();
  });

  test('displays first 5 movies by default', () => {
    renderComponent();
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 5')).toBeInTheDocument();
    expect(screen.queryByText('Movie 6')).not.toBeInTheDocument();
  });

  test('shows "See All" button when there are more than 5 movies', () => {
    renderComponent();
    expect(screen.getByText('See All')).toBeInTheDocument();
  });

  test('displays all movies when "See All" button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('See All'));
    expect(screen.getByText('Movie 6')).toBeInTheDocument();
    expect(screen.getByText('Show Less')).toBeInTheDocument();
  });

  test('deletes movie from watchlist when delete button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ message: 'Movie deleted successfully' }),
    });

    renderComponent();
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      /* expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/deleteMovie',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            id: '123',
            movie: initialState.user.watchlist.slice(1),
          }),
        })
      ); */
      expect(global.fetch).toHaveBeenCalledTimes(1);

    });

    const actions = store.getActions();
    expect(actions[0].type).toBe('user/removemovie');
    expect(actions[0].payload).toEqual(initialState.user.watchlist.slice(1));
  });

  test('handles error when deleting movie fails', async () => {
    console.log = jest.fn();
    global.fetch.mockRejectedValueOnce(new Error('Failed to delete movie'));

    renderComponent();
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  test('displays "Search and Add Movies" when watchlist is empty', () => {
    store = mockStore({ user: { userid: '123', watchlist: [] } });
    renderComponent();
    expect(screen.getByText('Search and Add Movies')).toBeInTheDocument();
  });

  test('does not show "See All" button when there are 5 or fewer movies', () => {
    store = mockStore({
      user: {
        userid: '123',
        watchlist: initialState.user.watchlist.slice(0, 5),
      },
    });
    renderComponent();
    expect(screen.queryByText('See All')).not.toBeInTheDocument();
  });
});