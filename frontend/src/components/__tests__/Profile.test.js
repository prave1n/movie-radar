import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Profile from '../Profile';

// Mock child components
jest.mock('../UserReviewCard', () => () => <div>Mocked UserReviewCard</div>);
jest.mock('../MovieCard', () => () => <div>Mocked MovieCard</div>);
jest.mock('../NavBar', () => () => <div>Mocked NavBar</div>);
jest.mock('../GenreSelectorPopup', () => ({ show, onHide, onSave }) => (
  show ? <div>Mocked GenreSelectorPopup <button onClick={onHide}>Close</button></div> : null
));
jest.mock('../PlayListsCard', () => () => <div>Mocked PlayListsCard</div>);

const mockStore = configureStore([]);

describe('Profile Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { userid: '123', email: 'test@example.com' }
    });

    global.fetch = jest.fn((url) => {
      if (url.includes('/get-preferred-genres')) {
        return Promise.resolve({
          json: () => Promise.resolve({ preferredGenres: [{ id: 1, name: 'Action' }] }),
          ok: false
        });
      }
      if (url.includes('/profile/')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            username: 'testuser',
            fname: 'Test',
            lname: 'User',
            email: 'test@example.com',
            watchlist: [
                { _id: '1', title: 'Movie 1', picture: 'movie1.jpg', dbid: 'db1' },
                { _id: '2', title: 'Movie 2', picture: 'movie2.jpg', dbid: 'db2' },
                { _id: '3', title: 'Movie 3', picture: 'movie3.jpg', dbid: 'db3' },
                { _id: '4', title: 'Movie 4', picture: 'movie4.jpg', dbid: 'db4' },
                { _id: '5', title: 'Movie 5', picture: 'movie5.jpg', dbid: 'db5' },
                { _id: '6', title: 'Movie 6', picture: 'movie6.jpg', dbid: 'db6' },
            ],
            preferredGenres: [{ id: 1, name: 'Action' }]
          }),
          ok: true
        });
      }
      if (url.includes('/watchlist/')) {
        return Promise.resolve({
          json: () => Promise.resolve([{ _id: '1', title: 'Test Movie' }]),
          ok: true
        });
      }
      if (url.includes('/user/reviews/')) {
        return Promise.resolve({
          json: () => Promise.resolve([{ _id: '1', content: 'Great movie!' }]),
          ok: true
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}), ok: true });
    });
  });

  it('renders profile information', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeTruthy();
      expect(screen.getByText('Personal Info')).toBeTruthy();
      expect(screen.getByText('Preferred Genres')).toBeTruthy();
    });
  });

  it('allows editing personal info', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('Edit'));
    });

    expect(screen.getByLabelText('Username')).toBeTruthy();
    expect(screen.getByLabelText('First Name')).toBeTruthy();
    expect(screen.getByLabelText('Last Name')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newusername' } });
    fireEvent.click(screen.getByLabelText('Save'));

    await waitFor(() => {
      /* expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/profile/123',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('newusername'),
        })
      ); */
      expect(fetch).toHaveBeenCalledTimes(5);
    });
  });

  it('opens genre selector popup', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Preferred Genres'));
    });

    expect(screen.getByText('Mocked GenreSelectorPopup')).toBeTruthy();
  });

  it('displays watchlist', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Watchlist')).toBeTruthy();
      expect(screen.getByText('Mocked MovieCard')).toBeTruthy();
    });
  });

  it('displays user reviews', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Reviews')).toBeTruthy();
      expect(screen.getByText('Mocked UserReviewCard')).toBeTruthy();
    });
  });

  /* it('handles error when updating profile', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ 
            error: 'Update failed', 
            preferredGenres: [{ id: 1, name: 'Action' }], 
            watchlist: [
                { _id: '1', title: 'Movie 1', picture: 'movie1.jpg', dbid: 'db1' },
                { _id: '2', title: 'Movie 2', picture: 'movie2.jpg', dbid: 'db2' },
                { _id: '3', title: 'Movie 3', picture: 'movie3.jpg', dbid: 'db3' },
                { _id: '4', title: 'Movie 4', picture: 'movie4.jpg', dbid: 'db4' },
                { _id: '5', title: 'Movie 5', picture: 'movie5.jpg', dbid: 'db5' },
                { _id: '6', title: 'Movie 6', picture: 'movie6.jpg', dbid: 'db6' },
            ], 
        }),
        ok: false
      })
    );
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('Edit'));
    });

    fireEvent.click(screen.getByLabelText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeTruthy();
    });
  }); */
});