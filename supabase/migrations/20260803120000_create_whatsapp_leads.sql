create table public.whatsapp_leads (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    phone text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.whatsapp_leads enable row level security;

-- Create policy to allow anonymous inserts (since users will submit from the frontend)
create policy "Allow anonymous inserts to whatsapp_leads"
on public.whatsapp_leads
for insert
to anon
with check (true);
