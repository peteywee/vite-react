import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Dashboard } from '../src/components/Dashboard';

describe('Dashboard Component', () => {
  it('renders without crashing', () => {
    render(<Dashboard />);
    expect(true).toBe(true);
  });
});
