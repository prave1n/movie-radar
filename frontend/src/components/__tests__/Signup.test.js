import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../Signup';

describe('Signup Component', () => {
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
    expect(screen.getByPlaceholderText('Enter your preffered username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter an url for your profile picture')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
  });

  test('signup button is present and clickable', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const signupButton = screen.getByRole('button', { name: 'Sign Up' });
    expect(signupButton).toBeInTheDocument();
    fireEvent.click(signupButton);
  });

    test('validates input fields and alerts on invalid data', async () => {
      window.alert = jest.fn();
  
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );
  
      const signupButton = screen.getByRole('button', { name: 'Sign Up' });
  
      fireEvent.click(signupButton);
  
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Please fill in all the fields to create an account');
      });
  
      window.alert.mockReset();

      fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: 'Doe' } });

      fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'invalid-email' } });
      fireEvent.click(signupButton);
  
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid email');
      });

      window.alert.mockReset();

      fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'john.doe@example.com' } });

      fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'weakpassword' } });
      fireEvent.click(signupButton);
  
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'Password must have minimum eight characters, at least one captial letter,at least one captial letter, one number and one special character:'
        );
      });

      window.alert.mockReset();
  
      fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'StrongP@ssw0rd' } });

      fireEvent.change(screen.getByPlaceholderText('Enter your preffered username'), { target: { value: 'johndoe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter an url for your profile picture'), { target: { value: 'https://example.com/pfp.jpg' } });

      fireEvent.click(signupButton);
  
      await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
      });
    });
});
