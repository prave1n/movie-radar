// Signup.test.js

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
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const signupButton = screen.getByRole('button', { name: 'Sign Up' });
    fireEvent.click(signupButton);

    await waitFor(() => {
        const alertMessage = screen.queryByText(/Please fill in all the fields to create an account/i);
        console.log(alertMessage);
        expect(alertMessage).toBeInTheDocument();
      });
  });
});
