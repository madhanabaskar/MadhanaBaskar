export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, projectType, message } = req.body;

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Send email using Resend REST API via Node.js native fetch (supported in Node 18+)
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Contact Form <onboarding@resend.dev>', // Replace this later with your own verified domain
                to: [process.env.CONTACT_EMAIL],
                subject: `New Contact Enquiry from ${name}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2 style="color: #111; border-bottom: 1px solid #ddd; padding-bottom: 10px;">New Contact Enquiry</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">${message}</div>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend error:', data);
            return res.status(response.status).json({ message: data.message || 'Error sending email. Please try again.' });
        }

        // Success response
        return res.status(200).json({ message: 'Message sent successfully', data });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
