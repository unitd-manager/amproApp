# Stripe Payment API Setup

## Stripe Keys
- **Public Key (Test)**: `pk_test_51SsQL3PZE5qSvArDSfmCI2XrcGcxlhkSl2BjYJOUqUODwbGPsrtbpWaIhwsqwaaA7886QCTtEOFb38cQruMQPily00PEXleFIN`
- **Secret Key (Test)**: You need to add this to your backend `.env` file
  - Go to: https://dashboard.stripe.com/test/apikeys
  - Copy your Secret Key (starts with `sk_test_`)

---

## Backend API Endpoint

### Create Payment Intent

**Endpoint**: `POST /payments/create-payment-intent`

**Request Body**:
```json
{
  "amount": 5000,
  "currency": "usd",
  "order_id": 123,
  "description": "Payment for order #123",
  "customer_email": "user@example.com",
  "customer_name": "John Doe"
}
```

**Response**:
```json
{
  "clientSecret": "pi_1234567890_secret_abcdefgh",
  "success": true
}
```

---

## Node.js/Express Implementation

### 1. Install Dependencies
```bash
npm install stripe dotenv
```

### 2. Create `.env` file in your backend root
```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

### 3. Create Payment Controller (`controllers/paymentController.js`)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', order_id, description, customer_email, customer_name } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe expects amount in cents/smallest unit
      currency: currency.toLowerCase(),
      description: description || `Payment for order #${order_id}`,
      metadata: {
        order_id: order_id,
        customer_email: customer_email,
        customer_name: customer_name
      },
      receipt_email: customer_email
    });

    console.log('✅ Payment Intent Created:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('❌ Payment Intent Creation Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create payment intent'
    });
  }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Missing paymentIntentId or paymentMethodId'
      });
    }

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });

    console.log('✅ Payment Confirmed:', {
      id: paymentIntent.id,
      status: paymentIntent.status
    });

    res.status(200).json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    });

  } catch (error) {
    console.error('❌ Payment Confirmation Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to confirm payment'
    });
  }
};

// Get Payment Intent Status
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing paymentIntentId'
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log('✅ Payment Status Retrieved:', {
      id: paymentIntent.id,
      status: paymentIntent.status
    });

    res.status(200).json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('❌ Get Payment Status Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to retrieve payment status'
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus
};
```

### 4. Create Payment Routes (`routes/paymentRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus
} = require('../controllers/paymentController');

// Create Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

// Confirm Payment
router.post('/confirm-payment', confirmPayment);

// Get Payment Status
router.get('/payment-status/:paymentIntentId', getPaymentStatus);

module.exports = router;
```

### 5. Add Routes to Main Server File (`server.js` or `app.js`)

```javascript
const paymentRoutes = require('./routes/paymentRoutes');

// Add this line with your other routes
app.use('/payments', paymentRoutes);
```

---

## Complete Example with Express Server

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Payment Routes
app.post('/payments/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', order_id, description, customer_email, customer_name } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      description: description || `Payment for order #${order_id}`,
      metadata: {
        order_id: order_id,
        customer_email: customer_email,
        customer_name: customer_name
      },
      receipt_email: customer_email
    });

    console.log('✅ Payment Intent Created:', paymentIntent.id);

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/payments/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });

    res.status(200).json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/payments/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## Testing the API

### Using cURL:
```bash
curl -X POST http://localhost:5000/payments/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "usd",
    "order_id": 123,
    "description": "Test Payment",
    "customer_email": "test@example.com",
    "customer_name": "Test User"
  }'
```

### Using Postman:
1. Set method to `POST`
2. URL: `http://localhost:5000/payments/create-payment-intent`
3. Body (JSON):
```json
{
  "amount": 5000,
  "currency": "usd",
  "order_id": 123,
  "description": "Test Payment",
  "customer_email": "test@example.com",
  "customer_name": "Test User"
}
```

---

## Important Notes

1. **Get Your Secret Key**: https://dashboard.stripe.com/test/apikeys
2. **Test Cards**: Use these for testing
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Authentication Required: `4000 0025 0000 3155`
3. **Amount Format**: Always send amount in cents (e.g., $50.00 = 5000)
4. **Currency**: Support `usd`, `eur`, `gbp`, `inr`, etc.
5. **Webhook Setup**: Set up webhooks at https://dashboard.stripe.com/test/webhooks for production use

---

## Frontend Integration (Already Updated)

Your React Native code in `Checkout.js`, `OrderDetails.js`, and `orderPage.js` has been updated to:
- Create payment intents via `/payments/create-payment-intent`
- Handle client secrets from the backend
- Process Stripe payments

The frontend is ready to use these APIs!
