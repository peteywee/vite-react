import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Auth } from '../src/components/Auth';

describe('Auth Component', () => {
  it('renders login form', () => {
    const { getByPlaceholderText } = render(<Auth />);
    expect(getByPlaceholderText('Email')).toBeDefined();
    expect(getByPlaceholderText('Password')).toBeDefined();
  });
});
