import { describe, it, expect } from 'vitest';
import { supabase } from '../src/lib/supabase';

describe('Supabase Client', () => {
  it('is defined', () => {
    expect(supabase).toBeDefined();
  });
});
