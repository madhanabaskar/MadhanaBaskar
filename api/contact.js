export default async function handler(req, res) {
    // 1. Accept POST requests only
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // 2. Validate environment variables
    if (!process.env.RESEND_API_KEY) {
        console.error('Missing RESEND_API_KEY environment variable');
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    if (!process.env.CONTACT_EMAIL) {
        console.error('Missing CONTACT_EMAIL environment variable');
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const { name, email, projectType, message } = req.body;

    // 3. Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        // 5. Use the Resend API correctly to send the enquiry
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // 7. Use a valid "from" address supported by Resend
                // The 'onboarding@resend.dev' address is the default test address.
                // It only works if the 'to' address is the email you signed up to Resend with.
                from: 'Contact Form <onboarding@resend.dev>',
                
                // 6. Send the enquiry to the email stored in env variable
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

        // 4. Return proper HTTP status codes
        if (!response.ok) {
            console.error('Resend error:', data);
            // Include a helpful message in the error
            return res.status(response.status).json({ success: false, error: data.message || 'Error sending email via Resend' });
        }

        // 8. Return JSON response such as { "success": true }
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
