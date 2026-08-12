const { Resend } = require('resend');

module.exports = async function handler(req, res) {
    // 1. Accept POST requests only
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // 2. Validate environment variables
    if (!process.env.RESEND_API_KEY) {
        console.error('Missing RESEND_API_KEY environment variable');
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, projectType, message } = req.body;

    // 3. Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        // 5. Use the Resend API to send the enquiry
        const { data, error } = await resend.emails.send({
            // 7. Use a valid "from" address supported by Resend
            // The 'onboarding@resend.dev' address is the default test address.
            // It only works if the 'to' address is the email you signed up to Resend with.
            from: 'Contact Form <onboarding@resend.dev>',
            
            // 6. Send the enquiry to the requested email
            to: ['madhanabaskar6@gmail.com'],
            subject: 'New Contact Form Submission',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #111; border-bottom: 1px solid #ddd; padding-bottom: 10px;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">${message}</div>
                </div>
            `
        });

        // 4. Return proper HTTP status codes
        if (error) {
            console.error('Resend error:', error);
            // Include a helpful message in the error
            return res.status(400).json({ success: false, error: error.message || 'Error sending email via Resend' });
        }

        // 8. Return JSON response such as { "success": true }
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
