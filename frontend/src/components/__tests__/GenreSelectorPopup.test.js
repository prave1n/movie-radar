import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenreSelectorPopup from '../GenreSelectorPopup';

describe('GenreSelectorPopup Component', () => {
  const onSaveMock = jest.fn();
  const onHideMock = jest.fn();

  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
  ];

  test('renders the modal with title and checkboxes', () => {
    render(
      <GenreSelectorPopup
        show={true}
        onHide={onHideMock}
        onSave={onSaveMock}
        initialGenres={[]}
      />
    );

    expect(screen.getByText('Select Your Preferred Genres')).toBeInTheDocument();
    genres.forEach(genre => {
      expect(screen.getByLabelText(genre.name)).toBeInTheDocument();
    });
  });

  test('checkbox selection and deselection', () => {
    render(
      <GenreSelectorPopup
        show={true}
        onHide={onHideMock}
        onSave={onSaveMock}
        initialGenres={[]}
      />
    );

    const actionCheckbox = screen.getByLabelText('Action');
    fireEvent.click(actionCheckbox);
    expect(actionCheckbox).toBeChecked();

    fireEvent.click(actionCheckbox);
    expect(actionCheckbox).not.toBeChecked();
  });

  test('allows a maximum of 3 genres to be selected', () => {
    render(
      <GenreSelectorPopup
        show={true}
        onHide={onHideMock}
        onSave={onSaveMock}
        initialGenres={[]}
      />
    );

    genres.forEach(genre => {
      const checkbox = screen.getByLabelText(genre.name);
      fireEvent.click(checkbox);
    });

    const fourthGenre = { id: 35, name: 'Comedy' };
    const comedyCheckbox = screen.getByLabelText(fourthGenre.name);
    fireEvent.click(comedyCheckbox);
    expect(comedyCheckbox).toBeDisabled();
  });

  test('Save button enabled/disabled based on selected genres', () => {
    render(
      <GenreSelectorPopup
        show={true}
        onHide={onHideMock}
        onSave={onSaveMock}
        initialGenres={[]}
      />
    );

    expect(screen.getByText('Save')).toBeDisabled();

    genres.forEach(genre => {
      const checkbox = screen.getByLabelText(genre.name);
      fireEvent.click(checkbox);
    });

    expect(screen.getByText('Save')).toBeEnabled();
  });

  test('calls onSave with selected genres when Save button is clicked', () => {
    render(
      <GenreSelectorPopup
        show={true}
        onHide={onHideMock}
        onSave={onSaveMock}
        initialGenres={[]}
      />
    );

    genres.forEach(genre => {
      const checkbox = screen.getByLabelText(genre.name);
      fireEvent.click(checkbox);
    });

    fireEvent.click(screen.getByText('Save'));
    expect(onSaveMock).toHaveBeenCalledWith(
      genres.map(genre => ({ id: genre.id, name: genre.name }))
    );
  });

  test('calls onHide when Cancel button is clicked', () => {
    render(
      <GenreSelectorPopup
        show={true}
        onHide={onHideMock}
        onSave={onSaveMock}
        initialGenres={[]}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onHideMock).toHaveBeenCalled();
  });
});
