import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PlayListsPage from '../PlayListsPage';
import NavBar from '../NavBar';
import WatchList from '../WatchList';
import PlayListsCard from '../PlayListsCard';

jest.mock('../NavBar', () => jest.fn(() => <div>NavBar Mock</div>));
jest.mock('../WatchList', () => jest.fn(() => <div>WatchList Mock</div>));
jest.mock('../PlayListsCard', () => jest.fn(({ list }) => <div>{list.name}</div>));

const mockStore = configureMockStore([]);

describe('PlayListsPage', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        playLists: [{ _id: '1', name: 'Playlist 1', description: 'Description 1' }],
        userid: '123',
      },
    });
  });

  test('renders PlayListsPage with NavBar and WatchList', () => {
    render(
      <Provider store={store}>
        <PlayListsPage />
      </Provider>
    );

    expect(screen.getByText('NavBar Mock')).toBeTruthy();
    expect(screen.getByText('WatchList Mock')).toBeTruthy();
    expect(screen.getByText('Your Playlists')).toBeTruthy();
    expect(screen.getByText('Playlist 1')).toBeTruthy();
  });

  test('opens create playlist dialog and interacts with form controls', () => {
    render(
      <Provider store={store}>
        <PlayListsPage />
      </Provider>
    );

    fireEvent.click(screen.getByText('Create Playlist'));

    expect(screen.getByText('Create New Playlist')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Enter playlist name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter playlist description')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Enter playlist name'), { target: { value: 'New Playlist' } });
    fireEvent.change(screen.getByPlaceholderText('Enter playlist description'), { target: { value: 'New Description' } });

    expect(screen.getByPlaceholderText('Enter playlist name')).toHaveValue('New Playlist');
    expect(screen.getByPlaceholderText('Enter playlist description')).toHaveValue('New Description');
  });

  test('creates a new playlist', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ playLists: [{ _id: '2', name: 'New Playlist', description: 'New Description' }] }),
      })
    );

    render(
      <Provider store={store}>
        <PlayListsPage />
      </Provider>
    );

    fireEvent.click(screen.getByText('Create Playlist'));

    fireEvent.change(screen.getByPlaceholderText('Enter playlist name'), { target: { value: 'New Playlist' } });
    fireEvent.change(screen.getByPlaceholderText('Enter playlist description'), { target: { value: 'New Description' } });

    fireEvent.click(screen.getByText('Create New Playlist', { selector: 'button' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    //await waitFor(() => expect(screen.getByText('New Playlist')).toBeInTheDocument());
  });

  test('handles fetch error', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    render(
      <Provider store={store}>
        <PlayListsPage />
      </Provider>
    );

    fireEvent.click(screen.getByText('Create Playlist'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Playlist' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Description' } });
    fireEvent.click(screen.getByText('Create New Playlist', { selector: 'button' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByText('New Playlist')).toBeNull());
  });
});

