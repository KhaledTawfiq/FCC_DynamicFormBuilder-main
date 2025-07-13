import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import App from '../src/App';

// Mock the FormBuilder component
jest.mock('../src/components/FormBuilder', () => {
  return function FormBuilderMock() {
    return (
      <div data-testid="form-builder">
        <button>Add Section</button>
        <button>View Json</button>
        <button>Submit</button>
        <button>Load Json</button>
      </div>
    );
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.querySelector('.App')).toBeTruthy();
  });

  it('renders the FormBuilder component', () => {
    render(<App />);
    expect(screen.getByTestId('form-builder')).toBeTruthy();
    expect(screen.getByText('Add Section')).toBeTruthy();
  });
});
