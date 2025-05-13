
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
