const supabaseUrl = 'https://syclttldcjmpykgcmzld.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y2x0dGxkY2ptcHlrZ2NtemxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTczNjMyNiwiZXhwIjoyMTAxMzEyMzI2fQ.6k7kgE2qnW3s2W80Ip4nIaGeKL6m2_TQFNqlMgT5JTI';

async function generateReport() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  // URL encode the query parameters
  const query = `?select=*&created_at=gte.${twentyFourHoursAgo}&order=created_at.desc`;
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/whatsapp_leads${query}`, {
      method: 'GET',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log(`\n========================================`);
    console.log(`📊 DAILY WHATSAPP LEAD REPORT`);
    console.log(`========================================`);
    console.log(`New Registrations in the last 24 hours: ${data.length}\n`);

    if (data.length > 0) {
      data.forEach((lead, index) => {
        const date = new Date(lead.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        console.log(`${index + 1}. ${lead.name} | Phone: +91 ${lead.phone} | Time: ${date}`);
      });
    } else {
      console.log("No new leads in the last 24 hours.");
    }
    console.log(`========================================\n`);
  } catch (error) {
    console.error('Error fetching leads:', error);
    process.exit(1);
  }
}

generateReport();
