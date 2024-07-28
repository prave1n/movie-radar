import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../Signup';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ result: true, useremail: 'test@example.com', username: 'testuser', otp: '123456', userId: '1' }),
  })
);

// Mock the emailjs.send function
jest.mock('@emailjs/browser', () => ({
  send: jest.fn(() => Promise.resolve()),
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('renders Signup component', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(screen.getByText(/Movie Radar/i)).toBeInTheDocument();
  });

  test('renders all input fields', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    //expect(screen.getByLabelText(/Profile Picture/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('signup button is present', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /SIGN UP/i })).toBeInTheDocument();
  });

  test('validates empty fields', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /SIGN UP/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please fill in all the fields to create an account');
    });
  });

  test('validates invalid email', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /SIGN UP/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please enter a valid email');
    });
  });

  test('validates weak password', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'weak' } });
    
    fireEvent.click(screen.getByRole('button', { name: /SIGN UP/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Password must have minimum eight characters, at least one captial letter,at least one captial letter, one number and one special character:');
    });
  });

  test('successful signup', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'StrongP@ssw0rd' } });
    //fireEvent.change(screen.getByLabelText(/Profile Picture/i), { target: { value: 'https://example.com/picture.jpg' } });
    
    fireEvent.click(screen.getByRole('button', { name: /SIGN UP/i }));
    
    await waitFor(() => {
      //xpect(fetch).toHaveBeenCalledWith('http://localhost:8080/signIn', expect.any(Object));
      expect(window.alert).toHaveBeenCalledWith('Account Created Successfully. Please verify your email before logging in');
      expect(mockNavigate).toHaveBeenCalledWith('/verify/1');
    });
  });

  test('handles server error', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ result: false, message: 'Server error' }),
      })
    );

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'StrongP@ssw0rd' } });
    
    fireEvent.click(screen.getByRole('button', { name: /SIGN UP/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Server error');
    });
  });

  test('renders links', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'a' && content.includes('Forgot password?');
    })).toBeInTheDocument();
  
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'a' && content.includes('Already have an account? Login');
    })).toBeInTheDocument();
  });
});