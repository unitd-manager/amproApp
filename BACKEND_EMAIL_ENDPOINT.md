# Quick Backend Implementation - Email Confirmation Endpoint

## The Issue
The frontend is trying to call `/commonApi/sendOrderConfirmation` but it's returning a 400 error.

## Quick Fix Options

### Option 1: Create the Endpoint Immediately

You need to add this endpoint to your backend (Node.js/Express example):

```javascript
// routes/commonApi.js or your main app file

const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'  // Generate at: https://myaccount.google.com/apppasswords
  }
});

// POST /commonApi/sendOrderConfirmation
router.post('/sendOrderConfirmation', async (req, res) => {
  try {
    const {
      order_id,
      user_email,
      user_name,
      payment_id,
      order_amount,
      items,
      shipping_address
    } = req.body;

    console.log('Received email request for order:', order_id);
    console.log('User email:', user_email);

    // Validate required fields
    if (!user_email || !user_name || !order_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: user_email, user_name, order_id'
      });
    }

    // Format items table
    const itemsHTML = items.map(item => `
      <tr>
        <td>${item.product_name || item.name || 'Unknown Product'}</td>
        <td>₹${item.unit_price || 0}</td>
        <td>${item.qty || item.quantity || 1}</td>
        <td>₹${((item.unit_price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');

    // User Email Template
    const userEmailHTML = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Order Confirmation - Order #${order_id}</h2>
          <p>Dear ${user_name},</p>
          <p>Thank you for your purchase! Your payment has been received and your order has been confirmed.</p>
          
          <h3>Order Details:</h3>
          <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
            ${itemsHTML}
          </table>
          
          <h3 style="margin-top: 20px;">Order Summary:</h3>
          <p><strong>Order ID:</strong> #${order_id}</p>
          <p><strong>Total Amount:</strong> ₹${order_amount}</p>
          <p><strong>Payment ID:</strong> ${payment_id}</p>
          <p><strong>Order Status:</strong> Confirmed</p>
          
          <h3>Shipping Address:</h3>
          <p>
            ${shipping_address?.address1 || ''}<br/>
            ${shipping_address?.address2 ? shipping_address.address2 + '<br/>' : ''}
            ${shipping_address?.city || ''}, ${shipping_address?.state || ''}<br/>
            ${shipping_address?.postal_code || ''}
          </p>
          
          <p style="margin-top: 30px; color: #666;">
            You will receive a shipping notification once your order is dispatched.<br/>
            If you have any questions, please contact our support team.
          </p>
          
          <p>Best regards,<br/><strong>AMPRO Team</strong></p>
        </body>
      </html>
    `;

    // Admin Email Template
    const adminEmailHTML = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Order Received - Order #${order_id}</h2>
          
          <h3>Customer Details:</h3>
          <p><strong>Name:</strong> ${user_name}</p>
          <p><strong>Email:</strong> ${user_email}</p>
          
          <h3>Order Items:</h3>
          <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
            ${itemsHTML}
          </table>
          
          <h3 style="margin-top: 20px;">Order Summary:</h3>
          <p><strong>Order ID:</strong> #${order_id}</p>
          <p><strong>Total Amount:</strong> ₹${order_amount}</p>
          <p><strong>Payment ID:</strong> ${payment_id}</p>
          <p><strong>Payment Status:</strong> ✅ Completed</p>
          
          <h3>Shipping Address:</h3>
          <p>
            ${shipping_address?.address1 || ''}<br/>
            ${shipping_address?.address2 ? shipping_address.address2 + '<br/>' : ''}
            ${shipping_address?.city || ''}, ${shipping_address?.state || ''}<br/>
            ${shipping_address?.postal_code || ''}
          </p>
          
          <p style="margin-top: 30px; color: #c0392b; font-weight: bold;">
            ⚠️ Please process this order for shipment immediately.
          </p>
        </body>
      </html>
    `;

    // Send User Email
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: user_email,
      subject: `Order Confirmation - Order #${order_id}`,
      html: userEmailHTML
    });

    // Send Admin Email
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: 'admin@ampro.com',
      subject: `New Order #${order_id} - Payment Completed`,
      html: adminEmailHTML
    });

    console.log('Emails sent successfully for order:', order_id);

    res.json({
      success: true,
      message: 'Confirmation emails sent successfully',
      user_email_sent: true,
      admin_email_sent: true
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send confirmation emails',
      error: error.message
    });
  }
});

module.exports = router;
```

### Option 2: If You Don't Have Email Setup Yet

Create a temporary endpoint that just logs and returns success:

```javascript
router.post('/sendOrderConfirmation', async (req, res) => {
  try {
    const { order_id, user_email } = req.body;
    console.log('Order confirmation requested for order:', order_id);
    console.log('Sending to email:', user_email);
    
    // TODO: Implement actual email sending
    
    res.json({
      success: true,
      message: 'Confirmation emails queued for sending',
      user_email_sent: false,  // Will be true once implemented
      admin_email_sent: false   // Will be true once implemented
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing email request',
      error: error.message
    });
  }
});
```

---

## Steps to Fix

### 1. Install Email Package
```bash
npm install nodemailer
```

### 2. Get Gmail App Password
- Go to: https://myaccount.google.com/apppasswords
- Generate a password for "Mail" on "Windows Computer"
- Use that password in the code above

### 3. Add Endpoint to Your API
- Add the code above to your backend routes
- Make sure it's under `/commonApi` path

### 4. Update Environment Variables (Optional)
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@ampro.com
```

### 5. Test Again
- Run the app
- Complete a payment
- Check console logs for email sending status

---

## Testing the Email Endpoint

### Using Postman/cURL:

```bash
curl -X POST http://localhost:8000/commonApi/sendOrderConfirmation \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 29,
    "user_email": "test@example.com",
    "user_name": "John Doe",
    "payment_id": "pay_S16YuOTrE8SqkM",
    "order_amount": "25.96",
    "items": [
      {
        "product_name": "Test Product",
        "unit_price": 22,
        "qty": 1
      }
    ],
    "shipping_address": {
      "address1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001"
    }
  }'
```

---

## Alternative Email Services

### SendGrid
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: user_email,
  from: 'noreply@ampro.com',
  subject: `Order Confirmation - Order #${order_id}`,
  html: userEmailHTML
});
```

### AWS SES
```bash
npm install aws-sdk
```

---

## What Changed in Frontend
I added better logging to help debug the 400 error. Now you'll see:
- Exact payload being sent
- Error status code
- Error response data
- Better console messages

This will help identify if it's a backend implementation issue or a data format issue.

---

## Next Steps
1. Implement the email endpoint using Option 1 above
2. Test with the postman curl command
3. Run payment flow again
4. Check console for email sending logs
5. Verify emails are received

Let me know if you get a different error or need help with a specific email service!
