-- Supabase Schema Setup --

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


-- RLS Policies --

-- Enable RLS
alter table users enable row level security;
alter table shifts enable row level security;
alter table venues enable row level security;
alter table messages enable row level security;
alter table paystubs enable row level security;
alter table clock_logs enable row level security;

-- Policies for users
create policy "Users can read their own profile"
on users for select
using (auth.uid() = id);

-- Policies for shifts
create policy "Staff can view their shifts"
on shifts for select
using (auth.uid() = user_id);

create policy "Managers/Admins can insert/edit shifts"
on shifts for insert, update
using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('manager', 'admin')));

-- Policies for venues
create policy "Anyone can view venues"
on venues for select
using (true);

create policy "Only Admins can edit venues"
on venues for insert, update, delete
using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

-- Policies for messages
create policy "Users can read/send their messages"
on messages for select, insert
using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Policies for paystubs
create policy "Users can read their paystubs"
on paystubs for select
using (auth.uid() = user_id);

-- Policies for clock_logs
create policy "Users can create and read their clock logs"
on clock_logs for select, insert
using (auth.uid() = user_id);
