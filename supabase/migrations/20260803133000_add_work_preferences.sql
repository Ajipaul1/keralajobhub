alter table public.job_applications 
add column work_type text default 'Not Specified',
add column relocate text default 'Not Specified';
