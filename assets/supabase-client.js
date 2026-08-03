// Initialize Supabase Client
const supabaseUrl = 'https://syclttldcjmpykgcmzld.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y2x0dGxkY2ptcHlrZ2NtemxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MzYzMjYsImV4cCI6MjEwMTMxMjMyNn0.Kze7Sve_PhzSmqAdaPG01YFgXBMDWucTEUUS4DyO0ec';

// The client is available on the window object because we loaded it via CDN in the HTML
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Function to handle the WhatsApp Job Alert Signup
async function handleWhatsAppSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const nameInput = form.querySelector('#wa-name');
    const phoneInput = form.querySelector('#wa-phone');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('wa-success-message');
    const formWrapper = document.getElementById('wa-form-wrapper');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    // Basic validation
    if (!name || phone.length < 10) {
        alert("Please enter a valid Name and 10-digit WhatsApp number.");
        return;
    }

    // Disable button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Processing...";

    try {
        const { error } = await supabase
            .from('whatsapp_leads')
            .insert([
                { name: name, phone: phone }
            ]);

        if (error) throw error;

        // On Success: Hide form, show activation button (Option A: 100% Free)
        formWrapper.style.display = 'none';
        successMsg.style.display = 'block';

    } catch (error) {
        console.error("Error saving lead:", error);
        alert("Something went wrong. Please try again.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Sign Up for Alerts";
    }
}

// Make it available globally if needed, and attach to form
document.addEventListener("DOMContentLoaded", () => {
    const waForm = document.getElementById('whatsapp-alert-form');
    if (waForm) {
        waForm.addEventListener('submit', handleWhatsAppSignup);
    }
});
