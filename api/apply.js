import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or specifically 'https://keralajobhub.com'
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, phone, district, place, age, qualification, experience, job_title, work_type, relocate } = req.body;

    if (!name || !phone || !district || !place || !age || !qualification || !experience || !job_title) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Supabase Client
    const supabaseUrl = 'https://syclttldcjmpykgcmzld.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y2x0dGxkY2ptcHlrZ2NtemxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MzYzMjYsImV4cCI6MjEwMTMxMjMyNn0.Kze7Sve_PhzSmqAdaPG01YFgXBMDWucTEUUS4DyO0ec';
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Insert into Supabase
        const { error: dbError } = await supabase
            .from('job_applications')
            .insert([{ name, phone, district, place, age: parseInt(age), qualification, experience, job_title, work_type, relocate }]);

        if (dbError) {
            console.error('Supabase Error:', dbError);
            throw new Error('Database insertion failed');
        }

        // 2. Send Email via Nodemailer (if SMTP_PASSWORD is set in Vercel Env Vars)
        const smtpPassword = process.env.SMTP_PASSWORD;
        if (smtpPassword) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'ajipaul96@gmail.com',
                    pass: smtpPassword,
                },
            });

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #1B4332; border-bottom: 2px solid #52B788; padding-bottom: 8px;">New Job Application Received</h2>
                    <p><strong>Job Title:</strong> ${job_title}</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Name</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">+91 ${phone}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Age</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${age}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Place</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${place}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">District</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${district}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Qualification</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${qualification}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Experience</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${experience}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Work Preference</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${work_type}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Willing to Relocate?</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${relocate}</td></tr>
                    </table>
                </div>
            `;

            await transporter.sendMail({
                from: 'info@keralajobhub.com',
                to: 'info@keralajobhub.com',
                subject: `🚨 New Application: ${name} for ${job_title}`,
                html: emailHtml,
            });
        } else {
            console.warn('SMTP_PASSWORD environment variable not set. Email not sent, but saved to DB.');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
