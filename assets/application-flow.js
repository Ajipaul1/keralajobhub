document.addEventListener('DOMContentLoaded', () => {
    // Select all WhatsApp Apply buttons (excluding the generic "HI" alert signup button)
    const applyButtons = document.querySelectorAll('a[href^="https://wa.me/"]:not([href$="text=HI"])');
    const modal = document.getElementById('job-application-modal');
    const form = document.getElementById('job-application-form');
    const closeBtn = document.getElementById('close-modal-btn');
    
    // Hidden inputs to store the targeted job details
    let currentWhatsAppUrl = '';
    let currentJobTitle = '';

    // Intercept clicks
    applyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop immediate redirect
            
            currentWhatsAppUrl = btn.href;
            
            // Extract job title from the text param if possible, or fallback to generic
            try {
                const urlObj = new URL(currentWhatsAppUrl);
                const textParam = urlObj.searchParams.get('text');
                currentJobTitle = textParam ? textParam.replace('I am interested in ', '').replace(' job', '') : 'Unknown Job';
            } catch (err) {
                currentJobTitle = 'General Application';
            }

            // Show modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        form.reset();
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';

        // Gather Data
        const formData = {
            name: document.getElementById('modal-name').value.trim(),
            phone: document.getElementById('modal-phone').value.trim(),
            district: document.getElementById('modal-district').value,
            place: document.getElementById('modal-place').value.trim(),
            age: document.getElementById('modal-age').value,
            qualification: document.getElementById('modal-qualification').value,
            experience: document.getElementById('modal-experience').value,
            job_title: currentJobTitle
        };

        // Basic Validation
        if(formData.phone.length < 10) {
            alert('Please enter a valid 10-digit WhatsApp number.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit & Apply on WhatsApp';
            return;
        }

        try {
            // Send to Vercel Backend API
            const response = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Submission failed');

            // Success! 
            closeModal();
            
            // Redirect to WhatsApp
            window.open(currentWhatsAppUrl, '_blank');
            
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit & Apply on WhatsApp';
        }
    });
});
