import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Vercel Cron Jobs send a GET request by default. We want to restrict access to this endpoint if needed,
    // but Vercel securely signs cron requests. For simplicity, we just allow GET/POST.
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const supabaseUrl = 'https://syclttldcjmpykgcmzld.supabase.co';
        const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y2x0dGxkY2ptcHlrZ2NtemxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTczNjMyNiwiZXhwIjoyMTAxMzEyMzI2fQ.6k7kgE2qnW3s2W80Ip4nIaGeKL6m2_TQFNqlMgT5JTI';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch leads from the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: leads, error } = await supabase
            .from('whatsapp_leads')
            .select('*')
            .gte('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching leads:', error);
            throw new Error('Database query failed');
        }

        // Send Email via Nodemailer
        const smtpPassword = process.env.SMTP_PASSWORD;
        if (!smtpPassword) {
            console.error('SMTP_PASSWORD environment variable is not set.');
            return res.status(500).json({ error: 'SMTP Configuration Missing' });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ajipaul96@gmail.com',
                pass: smtpPassword,
            },
        });

        const SENDER_EMAIL = 'info@keralajobhub.com';
        const RECEIVER_EMAIL = 'info@keralajobhub.com';

        let htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #1B4332; border-bottom: 2px solid #52B788; padding-bottom: 8px;">Daily Job Alerts Report</h2>
            <p>You have <strong>${leads.length}</strong> new WhatsApp job alert registrations in the last 24 hours.</p>
        `;

        if (leads.length > 0) {
            htmlBody += '<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
            htmlBody += '<tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;"><th style="padding: 10px; text-align: left;">Name</th><th style="padding: 10px; text-align: left;">WhatsApp Number</th></tr>';
            leads.forEach(lead => {
                htmlBody += `<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.name || 'N/A'}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">+91 ${lead.phone || 'N/A'}</td></tr>`;
            });
            htmlBody += '</table>';
        } else {
            htmlBody += '<p style="color: #64748b; font-style: italic;">No new leads today.</p>';
        }

        htmlBody += `
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Kerala Job Hub Automated System (Vercel Cron)</p>
        </div>
        `;

        await transporter.sendMail({
            from: SENDER_EMAIL,
            to: RECEIVER_EMAIL,
            subject: `📊 Daily WhatsApp Lead Report (${leads.length} New Registrations)`,
            html: htmlBody,
        });

        return res.status(200).json({ success: true, count: leads.length });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
