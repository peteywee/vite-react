import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RoleBasedDashboard } from '../src/components/RoleBasedDashboard';

describe('RoleBasedDashboard', () => {
  it('renders loading initially', () => {
    const { getByText } = render(<RoleBasedDashboard />);
    expect(getByText(/Loading role/i)).toBeDefined();
  });
});
