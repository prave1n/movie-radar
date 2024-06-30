import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../Login';

const mockStore = configureStore([]);
let store;

beforeEach(() => {
  store = mockStore({
    user: {
      userid: null,
    },
  });
});

describe('Login Component', () => {
  test('renders Login component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Movie Radar/i)).toBeInTheDocument();
  });

  test('renders email input', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
  });

  test('email input captures user input', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  
    const emailInput = screen.getByPlaceholderText('Enter Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
    expect(emailInput.value).toBe('test@example.com');
  });

  test('renders password input', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
  });

  test('password input covers user input', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    fireEvent.change(passwordInput, { target: { value: 'secretpassword' } });
  
    expect(passwordInput.value).toHaveLength('secretpassword'.length);
  });

  test('login button is present and clickable', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
  });
});
