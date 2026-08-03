import urllib.request
import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone

SUPABASE_URL = 'https://syclttldcjmpykgcmzld.supabase.co'
SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y2x0dGxkY2ptcHlrZ2NtemxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTczNjMyNiwiZXhwIjoyMTAxMzEyMzI2fQ.6k7kgE2qnW3s2W80Ip4nIaGeKL6m2_TQFNqlMgT5JTI'

# Email Configuration
# Using environment variables so you don't hardcode passwords in the repo
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = 587
SMTP_USER = os.environ.get('SMTP_USER', 'ajipaul96@gmail.com') # Login username
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '') # Requires user to set this

SENDER_EMAIL = 'info@keralajobhub.com'
RECEIVER_EMAIL = 'info@keralajobhub.com'

def fetch_leads():
    try:
        twenty_four_hours_ago = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S.000Z")
        url = f"{SUPABASE_URL}/rest/v1/whatsapp_leads?select=*&created_at=gte.{twenty_four_hours_ago}&order=created_at.desc"
        
        req = urllib.request.Request(url)
        req.add_header('apikey', SERVICE_ROLE_KEY)
        req.add_header('Authorization', f'Bearer {SERVICE_ROLE_KEY}')
        req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching leads: {e}")
        return []

def send_email_report(leads):
    if not SMTP_PASSWORD:
        print("Error: SMTP_PASSWORD environment variable is not set. Cannot send email.")
        return

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL
    msg['Subject'] = f"📊 Daily WhatsApp Lead Report ({len(leads)} New Registrations)"

    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1B4332; border-bottom: 2px solid #52B788; padding-bottom: 8px;">Daily Job Alerts Report</h2>
        <p>You have <strong>{len(leads)}</strong> new WhatsApp job alert registrations in the last 24 hours.</p>
    """

    if leads:
        body += '<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">'
        body += '<tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;"><th style="padding: 10px; text-align: left;">Name</th><th style="padding: 10px; text-align: left;">WhatsApp Number</th></tr>'
        for lead in leads:
            body += f'<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">{lead.get("name", "N/A")}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">+91 {lead.get("phone", "N/A")}</td></tr>'
        body += '</table>'
    else:
        body += '<p style="color: #64748b; font-style: italic;">No new leads today.</p>'

    body += """
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Kerala Job Hub Automated System</p>
    </div>
    """

    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.close()
        print(f"Report successfully sent to {RECEIVER_EMAIL} from {SENDER_EMAIL}")
    except Exception as e:
        print(f"SMTP error: {e}")

if __name__ == "__main__":
    leads = fetch_leads()
    print(f"Found {len(leads)} leads. Sending email...")
    send_email_report(leads)
