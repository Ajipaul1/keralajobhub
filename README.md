# Kerala Job Hub

Kerala Job Hub is a static, SEO-focused job listing website targeting Kochi, Kerala. The site is designed as a lead-generation business:

- Job seekers browse jobs for free
- Employers pay to post jobs from Rs.199 to Rs.999
- Applications happen through WhatsApp or external links

## Pages included

- `index.html`
- `jobs-in-kochi.html`
- `part-time-jobs-kochi.html`
- `infopark-jobs-kochi.html`
- `fresher-jobs-kochi.html`
- `urgent-jobs-kochi.html`
- `accountant-jobs-kochi.html`
- `driver-jobs-kochi.html`
- `data-entry-jobs-kochi.html`
- `digital-marketing-jobs-kochi.html`
- `work-from-home-jobs-kochi.html`
- `night-shift-jobs-kochi.html`
- `part-time-jobs-for-students-kochi.html`

## Seed keywords used for the homepage

- jobs in kochi
- job vacancies in kochi
- part time jobs in kochi
- infopark jobs kochi
- jobs in kochi for freshers
- work from home jobs in kochi
- urgent job vacancies in kochi
- accountant jobs in kochi
- driver jobs in kochi
- data entry jobs in kochi
- digital marketing jobs in kochi
- night shift jobs in kochi
- part time jobs in kochi for students

## Deploy to GitHub Pages

1. Create a GitHub repository and push these files.
2. In the repository, open `Settings` > `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select the `main` branch and the `/ (root)` folder.
5. Save the settings and wait for GitHub Pages to publish the site.

## Connect the custom domain

The repo already includes a `CNAME` file with:

`keralajobhub.com`

To point the domain to GitHub Pages:

1. Go to your domain DNS settings.
2. Add these four `A` records for the root domain:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Add a `CNAME` record for `www` pointing to your GitHub Pages host, usually `yourusername.github.io`.
4. In GitHub repository `Settings` > `Pages`, set the custom domain to `keralajobhub.com`.
5. Enable HTTPS after the DNS records are active.

## Before launch

- Replace the generic WhatsApp links with your actual business WhatsApp number or listing-specific apply links.
- Update sample jobs with real postings collected manually.
- Keep page content fresh to improve trust and SEO performance.
