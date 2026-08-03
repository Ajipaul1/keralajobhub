import csv
import smtplib
import time
import random
import sys
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USER = 'ajipaul96@gmail.com'
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '') # Must be set in environment
SENDER_EMAIL = 'info@keralajobhub.com'
TEST_RECEIVER = 'info@keralajobhub.com'
CSV_FILE = 'consultancy_emails.csv'

SUBJECT_TEMPLATE = "B2B Integration: Candidate Sourcing & Revenue Protocol for {agency_name}"

BODY_TEMPLATE = """<html>
<body>
<p>To the <strong>{agency_name}</strong> Leadership Team,</p>

<p>We operate Kerala Job Hub, a targeted employment infrastructure routing high-intent candidates to verified agencies. We have audited your current pipeline and identified your consultancy as a viable partner for our lead distribution network.</p>

<p>We are opening our platform to host your active requisitions. We will deploy our internal SEO and social distribution architecture to drive targeted candidates directly to your funnel.</p>

<p>Our B2B operational terms are strictly performance-based:</p>
<ul>
<li><strong>Standard Requisitions (Zero-Fee):</strong> If your placement process is entirely free for the candidate, we distribute and promote your listings at zero cost.</li>
<li><strong>Monetized Requisitions (Placement Fee):</strong> For roles where your agency collects a placement fee, our infrastructure operates on a 33% revenue-share model, payable only after a successful candidate transition and monetization.</li>
<li><strong>Gulf / International Placements:</strong> Custom service-level agreements (SLAs) will be drafted following an audit of your international pipeline.</li>
</ul>

<p>We absorb the marketing overhead and candidate acquisition costs. You only share capital on successfully monetized leads.</p>

<p>Confirm your agency's operational model (Free vs. Monetized) so we can configure your profile and authorize your team to begin uploading requisitions to the platform.</p>

<p>Regards,<br><br>
<strong>Aji Paul</strong><br>
Founder, <a href="https://keralajobhub.com" style="color: #059669; font-weight: bold; text-decoration: underline;">Kerala Job Hub</a><br>
Phone: <a href="tel:+916282520339">+91 6282520339</a> | <a href="https://wa.me/916282520339" style="color: #25D366; font-weight: bold; text-decoration: none;">WhatsApp Us</a></p>
</body>
</html>"""

def send_email(to_email, agency_name, is_test=False):
    if not SMTP_PASSWORD:
        print("Error: SMTP_PASSWORD environment variable not set.")
        sys.exit(1)

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = TEST_RECEIVER if is_test else to_email
    msg['Subject'] = SUBJECT_TEMPLATE.format(agency_name=agency_name)

    # Convert line breaks to HTML for better formatting, or just send as plain text. 
    # Since it's a professional B2B email, plain text often bypasses spam filters better than HTML.
    # Convert to HTML
    body_text = BODY_TEMPLATE.format(agency_name=agency_name)
    msg.attach(MIMEText(body_text, 'html'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SENDER_EMAIL, msg['To'], msg.as_string())
        server.close()
        print(f"[{'TEST ' if is_test else ''}SUCCESS] Sent email to {msg['To']} (Agency: {agency_name})")
        
        # Log to prevent duplicates
        if not is_test:
            with open("sent.log", "a", encoding="utf-8") as logf:
                logf.write(email_address + "\n")
        
        return True
    except Exception as e:
        print(f"[{'TEST ' if is_test else ''}FAILED] Could not send to {msg['To']}. Error: {e}")
        return False

def run_campaign(is_test=False):
    if not os.path.exists(CSV_FILE):
        print(f"Error: {CSV_FILE} not found.")
        return

    with open(CSV_FILE, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        leads = list(reader)

    if is_test:
        print("--- RUNNING TEST MODE ---")
        first_lead = leads[0]
        send_email(first_lead['Email Address'], first_lead['Consultancy Name'], is_test=True)
        print("Test complete. Check the inbox of info@keralajobhub.com.")
        return

    print("--- RUNNING LIVE CAMPAIGN ---")
    print(f"Total leads found: {len(leads)}")
    
    sent_list = []
    if os.path.exists("sent.log"):
        with open("sent.log", "r", encoding="utf-8") as logf:
            sent_list = [line.strip() for line in logf.readlines()]
            
    success_count = 0
    for index, row in enumerate(leads):
        email = row.get('Email Address', '').strip()
        agency = row.get('Consultancy Name', '').strip()
        
        if not email:
            print(f"[SKIPPED] {agency} has no email address.")
            continue
            
        if email in sent_list:
            print(f"[SKIPPED] Already sent to {email} ({agency}).")
            continue
            
        success = send_email(email, agency, is_test=False)
        if success:
            success_count += 1
            
        # Stop if it's the last lead
        if index == len(leads) - 1:
            break
            
        # Secure 2-minute delay (120 to 140 seconds randomized to look human)
        delay = random.randint(120, 140)
        print(f"Sleeping for {delay} seconds to prevent spam ban...")
        time.sleep(delay)

    print(f"--- CAMPAIGN COMPLETE ---")
    print(f"Successfully sent {success_count} emails.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == '--run':
        run_campaign(is_test=False)
    else:
        run_campaign(is_test=True)
