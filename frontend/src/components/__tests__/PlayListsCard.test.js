import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import PlayListsCard from '../PlayListsCard';

const mockStore = configureStore([]);

describe('PlayListsCard Component', () => {
  let store;
  const initialState = {
    user: {
      userid: '123',
      playLists: [
        {
          _id: 'list1',
          name: 'My Playlist',
          description: 'A cool playlist',
          public: true,
          movies: ['movie1', 'movie2', 'movie3', 'movie4', 'movie5', 'movie6'],
        },
      ],
    },
  };

  const mockList = {
    _id: 'list1',
    name: 'My Playlist',
    description: 'A cool playlist',
    public: true,
  };

  beforeEach(() => {
    store = mockStore(initialState);
    global.fetch = jest.fn();
    global.alert = jest.fn();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <PlayListsCard list={mockList} />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders PlayListsCard component with correct title and description', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ movieList: [] }),
    });

    renderComponent();
    
    expect(screen.getByText('My Playlist')).toBeInTheDocument();
    expect(screen.getByText('A cool playlist')).toBeInTheDocument();
  });

  test('displays public/private chip correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ movieList: [] }),
    });

    renderComponent();
    
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  test('fetches and displays movies', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        movieList: [
          { _id: 'movie1', title: 'Movie 1', picture: 'pic1.jpg', dbid: 'db1' },
          { _id: 'movie2', title: 'Movie 2', picture: 'pic2.jpg', dbid: 'db2' },
        ],
      }),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Movie 2')).toBeInTheDocument();
    });
  });

  test('deletes playlist when delete button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ movieList: [] }),
    });
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ user: { playLists: [] } }),
    });

    renderComponent();

    fireEvent.click(screen.getByText('Delete Playlist'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/delPlayList',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userID: '123',
            listID: 'list1',
          }),
        })
      );
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe('user/updatePlayLists');
    expect(actions[0].payload).toEqual([]);
  });

  test('changes privacy when privacy button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ movieList: [] }),
    });
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ playLists: [{ ...mockList, public: false }] }),
    });

    renderComponent();

    fireEvent.click(screen.getByText('Make Private'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/changePrivacy',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userID: '123',
            listID: 'list1',
            pub: true,
          }),
        })
      );
      expect(global.alert).toHaveBeenCalledWith('My Playlist changed to Private');
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe('user/updatePlayLists');
    expect(actions[0].payload).toEqual([{ ...mockList, public: false }]);
  });

  test('deletes movie from playlist when delete icon is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        movieList: [
          { _id: 'movie1', title: 'Movie 1', picture: 'pic1.jpg', dbid: 'db1' },
        ],
      }),
    });
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        user: {
          playLists: [{ ...mockList, movies: [] }],
        },
      }),
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('delete'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/delmoviePlayList',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userID: '123',
            listID: 'list1',
            movieID: 'movie1',
          }),
        })
      );
      expect(global.alert).toHaveBeenCalledWith('Movie deleted from My Playlist');
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe('user/updatePlayLists');
    expect(actions[0].payload).toEqual([{ ...mockList, movies: [] }]);
  });

  test('displays "Playlist is Empty" when there are no movies', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ movieList: [] }),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Playlist is Empty')).toBeInTheDocument();
    });
  });

  test('shows "See All" button when there are more than 5 movies', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        movieList: Array(6).fill().map((_, i) => ({
          _id: `movie${i+1}`,
          title: `Movie ${i+1}`,
          picture: `pic${i+1}.jpg`,
          dbid: `db${i+1}`,
        })),
      }),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('See All')).toBeInTheDocument();
    });
  });

  test('toggles between "See All" and "Show Less" when button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        movieList: Array(6).fill().map((_, i) => ({
          _id: `movie${i+1}`,
          title: `Movie ${i+1}`,
          picture: `pic${i+1}.jpg`,
          dbid: `db${i+1}`,
        })),
      }),
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.click(screen.getByText('See All'));
    });

    expect(screen.getByText('Show Less')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Show Less'));

    expect(screen.getByText('See All')).toBeInTheDocument();
  });
});