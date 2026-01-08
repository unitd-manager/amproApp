# Email Confirmation Service Implementation

## Backend Setup Required

You need to implement an email endpoint in your backend to send confirmation emails.

### 1. New API Endpoint

**Endpoint:** `POST /emails/sendOrderConfirmation`

**Request Body:**
```json
{
  "order_id": 40,
  "user_email": "customer@example.com",
  "user_name": "John Doe",
  "payment_id": "pay_xxxxxxxxxxxx",
  "order_amount": "25.96",
  "items": [
    {
      "product_name": "AMPRO BRAND CARDAMMOND GREEN 500G",
      "unit_price": 22,
      "quantity": 1,
      "discount_percentage": 0,
      "images": ["path/to/image.jpg"]
    }
  ],
  "shipping_address": {
    "address1": "12, mettus street",
    "address2": "",
    "city": "tirunelveli",
    "state": "Tamil Nadu",
    "postal_code": "627001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Confirmation emails sent successfully",
  "user_email_sent": true,
  "admin_email_sent": true
}
```

---

## Example Implementation (Node.js/Express)

### Install Required Packages
```bash
npm install nodemailer dotenv
```

### Create Email Service (services/emailService.js)

```javascript
const nodemailer = require('nodemailer');

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOrderConfirmation = async (orderData) => {
  try {
    const {
      order_id,
      user_email,
      user_name,
      payment_id,
      order_amount,
      items,
      shipping_address
    } = orderData;

    // User Confirmation Email
    const userEmailContent = `
      <h2>Order Confirmation - Order #${order_id}</h2>
      <p>Dear ${user_name},</p>
      <p>Thank you for your purchase! Your order has been confirmed and payment has been received.</p>
      
      <h3>Order Details:</h3>
      <table border="1" cellpadding="10">
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
        ${items.map(item => `
          <tr>
            <td>${item.product_name}</td>
            <td>₹${item.unit_price}</td>
            <td>${item.quantity || item.qty}</td>
            <td>₹${(item.unit_price * (item.quantity || item.qty)).toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>
      
      <h3>Order Summary:</h3>
      <p><strong>Total Amount:</strong> ₹${order_amount}</p>
      <p><strong>Payment ID:</strong> ${payment_id}</p>
      <p><strong>Order Status:</strong> Confirmed</p>
      
      <h3>Shipping Address:</h3>
      <p>
        ${shipping_address.address1}<br/>
        ${shipping_address.address2 ? shipping_address.address2 + '<br/>' : ''}
        ${shipping_address.city}, ${shipping_address.state}<br/>
        ${shipping_address.postal_code}
      </p>
      
      <p>You will receive a shipping notification once your order is dispatched.</p>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br/>AMPRO Team</p>
    `;

    // Admin Notification Email
    const adminEmailContent = `
      <h2>New Order Received - Order #${order_id}</h2>
      
      <h3>Customer Details:</h3>
      <p><strong>Name:</strong> ${user_name}</p>
      <p><strong>Email:</strong> ${user_email}</p>
      
      <h3>Order Items:</h3>
      <table border="1" cellpadding="10">
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
        ${items.map(item => `
          <tr>
            <td>${item.product_name}</td>
            <td>₹${item.unit_price}</td>
            <td>${item.quantity || item.qty}</td>
            <td>₹${(item.unit_price * (item.quantity || item.qty)).toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>
      
      <h3>Order Summary:</h3>
      <p><strong>Order ID:</strong> ${order_id}</p>
      <p><strong>Total Amount:</strong> ₹${order_amount}</p>
      <p><strong>Payment ID:</strong> ${payment_id}</p>
      <p><strong>Payment Status:</strong> Completed</p>
      
      <h3>Shipping Address:</h3>
      <p>
        ${shipping_address.address1}<br/>
        ${shipping_address.address2 ? shipping_address.address2 + '<br/>' : ''}
        ${shipping_address.city}, ${shipping_address.state}<br/>
        ${shipping_address.postal_code}
      </p>
      
      <p><strong>Please process this order for shipment.</strong></p>
    `;

    // Send emails
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: `Order Confirmation - Order #${order_id}`,
      html: userEmailContent
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order_id} - Payment Completed`,
      html: adminEmailContent
    });

    return {
      success: true,
      message: 'Emails sent successfully',
      user_email_sent: true,
      admin_email_sent: true
    };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
};

module.exports = { sendOrderConfirmation };
```

### Add Route Handler (routes/emailRoutes.js)

```javascript
const express = require('express');
const router = express.Router();
const { sendOrderConfirmation } = require('../services/emailService');

router.post('/sendOrderConfirmation', async (req, res) => {
  try {
    const result = await sendOrderConfirmation(req.body);
    res.json(result);
  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send confirmation emails',
      error: error.message
    });
  }
});

module.exports = router;
```

### Environment Variables (.env)

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@ampro.com
```

### Add to Main App (app.js or server.js)

```javascript
const emailRoutes = require('./routes/emailRoutes');
app.use('/api/emails', emailRoutes);
```

---

## Alternative Email Services

### Using SendGrid
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: user_email,
  from: 'noreply@ampro.com',
  subject: `Order Confirmation - Order #${order_id}`,
  html: userEmailContent,
};

await sgMail.send(msg);
```

### Using AWS SES
```bash
npm install aws-sdk
```

---

## Frontend Integration (Already Done)

The frontend already sends this data:
- ✅ Order ID
- ✅ User email and name
- ✅ Payment ID
- ✅ Order amount
- ✅ Order items (with prices, quantities, images)
- ✅ Shipping address

---

## Email Flow Diagram

```
Payment Success (Razorpay)
        ↓
updateOrderStatus (Mark as Completed)
        ↓
sendConfirmationEmails API Call
        ↓
    ┌───┴────┐
    ↓        ↓
 User Email Admin Email
    ↓        ↓
  Gmail    Admin Inbox
    ↓        ↓
 Confirmed Notified
```

---

## Testing the Email Feature

1. **Test with Razorpay Payment**
   - Complete order with test card
   - Check user email for confirmation
   - Check admin email for notification

2. **Check Console Logs**
   - Frontend: `Sending confirmation emails...`
   - Backend: Check email sending logs

3. **Test Email Content**
   - Verify order details are correct
   - Check product information
   - Verify shipping address

---

## Production Checklist

- [ ] Setup email service (Gmail, SendGrid, AWS SES)
- [ ] Add environment variables
- [ ] Test with real email addresses
- [ ] Add email templates/styling
- [ ] Implement email retry logic
- [ ] Add email logs/history
- [ ] Setup unsubscribe links
- [ ] Test HTML rendering across email clients
- [ ] Add order tracking link in email
- [ ] Implement SMS notifications (optional)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not sending | Check email service credentials |
| User email field empty | Verify USER data in AsyncStorage includes email |
| Email not received | Check spam/junk folders |
| Formatting issues | Test HTML in email preview tools |
| Rate limiting | Implement queue system for bulk emails |

