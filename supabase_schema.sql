
-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text check (role in ('staff', 'manager', 'admin', 'dev')),
  profile_photo_url text,
  created_at timestamp default now()
);

-- Venues
create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat double precision,
  lng double precision,
  created_at timestamp default now()
);

-- Shifts
create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  venue_id uuid references venues(id),
  start_time timestamp,
  end_time timestamp,
  status text check (status in ('scheduled', 'completed', 'missed')),
  created_at timestamp default now()
);

-- Clock-in logs
create table if not exists clock_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  venue_id uuid references venues(id),
  clock_in timestamp,
  clock_out timestamp,
  lat double precision,
  lng double precision,
  out_of_bounds boolean default false,
  created_at timestamp default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references users(id),
  receiver_id uuid references users(id),
  message text,
  attachment_url text,
  created_at timestamp default now()
);

-- Pay stubs
create table if not exists paystubs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  hours_worked numeric,
  pay_rate numeric,
  total_pay numeric,
  stub_url text,
  issued_at timestamp default now()
);
