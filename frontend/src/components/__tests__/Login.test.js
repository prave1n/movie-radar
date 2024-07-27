import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../Login';

const mockStore = configureStore([]);
let store;

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
  store = mockStore({
    user: {
      userid: null,
    },
  });
  global.fetch = jest.fn();
  global.alert = jest.fn();
});

describe('Login Component', () => {
  const renderComponent = () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders Login component with correct title', () => {
    renderComponent();
    expect(screen.getByText('Movie Radar')).toBeInTheDocument();
  });

  test('renders email input field', () => {
    renderComponent();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  test('renders password input field', () => {
    renderComponent();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('email input captures user input', () => {
    renderComponent();
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('password input captures user input', () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'secretpassword' } });
    expect(passwordInput.value).toBe('secretpassword');
  });

  test('login button is present and clickable', () => {
    renderComponent();
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();
  });

  test('renders "Forgot password?" link', () => {
    renderComponent();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  test('renders "Don\'t have an account? Sign Up" link', () => {
    renderComponent();
    expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
  });

  test('successful login redirects to myhome page', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ login: true, user: { id: '123' }, token: 'fakeToken' }),
    });

    renderComponent();
    
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/myhome');
      expect(localStorage.getItem('token')).toBe('fakeToken');
    });
  });

  test('unsuccessful login shows alert', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ login: false, message: 'Invalid credentials' }),
    });

    renderComponent();
    
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('handles network error during login', async () => {
    console.log = jest.fn();
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderComponent();
    
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});

/* import React from 'react';
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
}); */
