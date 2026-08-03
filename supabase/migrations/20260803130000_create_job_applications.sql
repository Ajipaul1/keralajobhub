create table public.job_applications (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    phone text not null,
    district text not null,
    place text not null,
    age integer not null,
    qualification text not null,
    experience text not null,
    job_title text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.job_applications enable row level security;

-- Create policy to allow anonymous inserts (in case we ever insert from frontend directly)
create policy "Allow anonymous inserts to job_applications"
on public.job_applications
for insert
to anon
with check (true);
