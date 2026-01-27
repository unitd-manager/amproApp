# Stripe Payment Flow - Visual Guide

## Complete Order Payment Process

```
┌─────────────────────────────────────────────────────────────┐
│           ORDER DETAILS SCREEN                              │
│                                                             │
│  [Order #123]                                              │
│  Subtotal: ₹5000                                           │
│  Total: ₹5900                                              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │        [Complete Order Button]                        │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           PAYMENT METHOD ALERT                              │
│                                                             │
│  "Complete Order - How would you like to proceed?"         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Cancel     │  │ Pay with     │  │  Cash on     │     │
│  │              │  │  Stripe      │  │  Delivery    │     │
│  └──────────────┘  └──────┬───────┘  └──────────────┘     │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │ User clicks "Pay with Stripe"
                            ▼
┌─────────────────────────────────────────────────────────────┐
│    STEP 1: CREATE PAYMENT INTENT (Backend)                  │
│                                                             │
│    POST /payments/create-payment-intent                    │
│    {                                                        │
│      amount: 590000 (cents),                               │
│      currency: "usd",                                       │
│      order_id: 123,                                         │
│      customer_email: "user@example.com",                    │
│      customer_name: "John Doe"                              │
│    }                                                        │
│                                                             │
│    Response:                                               │
│    {                                                        │
│      clientSecret: "pi_123...secret...",                   │
│      success: true                                          │
│    }                                                        │
│                                                             │
│    ✅ clientSecret saved in state                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│    STEP 2: SHOW CARD PAYMENT MODAL                          │
│                                                             │
│    ┌───────────────────────────────────────────────────┐   │
│    │          Enter Card Details                       │   │
│    │                                                   │   │
│    │  ┌─────────────────────────────────────────────┐ │   │
│    │  │  Card Number                               │ │   │
│    │  │  [4242 4242 4242 4242 ]                   │ │   │
│    │  │                                             │ │   │
│    │  │  Expiration          CVC                    │ │   │
│    │  │  [12/25        ]    [123    ]              │ │   │
│    │  └─────────────────────────────────────────────┘ │   │
│    │                                                   │   │
│    │  Amount: ₹5900                                   │   │
│    │                                                   │   │
│    │  ┌────────────────┐  ┌────────────────┐        │   │
│    │  │   [Cancel]     │  │  [Pay Now ✓]   │        │   │
│    │  └────────────────┘  └────────────────┘        │   │
│    │                                                   │   │
│    │  Test Card: 4242 4242 4242 4242                │   │
│    │  (Any future date & any 3 digits)              │   │
│    └───────────────────────────────────────────────┘   │
│                                                         │
│    User enters card details                           │
│    CardField validates input                          │
│    Pay Now button becomes enabled when complete       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ User clicks "Pay Now"
┌─────────────────────────────────────────────────────────────┐
│    STEP 3: CONFIRM PAYMENT (Stripe SDK)                    │
│                                                             │
│    confirmPayment(clientSecret, {                         │
│      paymentMethodType: 'Card'                            │
│    })                                                      │
│                                                             │
│    Stripe securely processes the card                     │
│    (Card data never touches your backend)                │
│                                                             │
│    Response:                                              │
│    {                                                       │
│      paymentIntent: {                                      │
│        id: "pi_123...payment...",                         │
│        status: "Succeeded"                                │
│      }                                                      │
│    }                                                       │
│                                                             │
│    ✅ Payment Successful!                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│    STEP 4: UPDATE ORDER STATUS                             │
│                                                             │
│    POST /orders/updateOrderStatus                         │
│    {                                                       │
│      order_id: 123,                                       │
│      order_status: "completed",                          │
│      transaction_id: "pi_123..."                         │
│    }                                                       │
│                                                             │
│    ✅ Order marked as completed                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│    STEP 5: SEND CONFIRMATION EMAIL                         │
│                                                             │
│    POST /commonApi/sendOrderConfirmation                  │
│    {                                                       │
│      order_id: 123,                                       │
│      user_email: "user@example.com",                      │
│      user_name: "John Doe",                               │
│      payment_id: "pi_123...",                             │
│      order_amount: 5900,                                  │
│      items: [...]                                         │
│    }                                                       │
│                                                             │
│    ✅ Email sent to customer                             │
│    ✅ Email sent to admin                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│    STEP 6: SHOW SUCCESS MESSAGE                            │
│                                                             │
│    Alert: "Payment Successful"                            │
│    Payment ID: pi_123...                                  │
│    Message: Your order has been confirmed.               │
│             A confirmation email has been sent.          │
│                                                             │
│    ┌──────────────────────────────────────────────────┐  │
│    │              [OK]                                │  │
│    └──────────────────────────────────────────────────┘  │
│                                                             │
│    ✅ Close modal                                        │
│    ✅ Navigate back to previous screen                 │
│    ✅ Order status updated to "Completed"              │
└─────────────────────────────────────────────────────────────┘
```

## Payment Failure Scenarios

### Scenario 1: Invalid Card
```
User enters: 4000 0000 0000 0002 (Test decline card)
     ▼
Stripe returns error: "Your card was declined"
     ▼
Show Alert: "Payment Failed - Your card was declined"
     ▼
User can try again with different card
```

### Scenario 2: Network Error
```
POST /payments/create-payment-intent fails
     ▼
Show Alert: "Failed to create payment intent"
     ▼
Modal doesn't open
     ▼
User can click "Complete Order" again
```

### Scenario 3: User Cancels
```
Modal open -> CardField showing
     ▼
User clicks [Cancel] button
     ▼
Modal closes
     ▼
Return to Order Details screen
     ▼
Order remains incomplete
```

## State Management

### State Variables
```javascript
state {
  showPaymentModal: false,      // Controls modal visibility
  cardDetails: null,            // Card data from CardField
  clientSecret: null,           // Payment intent secret
  paymentProcessing: false      // Loading state during payment
}
```

### State Transitions
```
Initial
  ↓
User clicks "Complete Order"
  ↓
User selects "Pay with Stripe"
  ├─→ Create Payment Intent
  ├─→ showPaymentModal = true
  ├─→ Display Modal
  ↓
User enters card details
  ├─→ CardField updates cardDetails
  ├─→ Pay Now button enabled (cardDetails.complete = true)
  ↓
User clicks "Pay Now"
  ├─→ paymentProcessing = true
  ├─→ Confirm Payment
  ├─→ Update Order Status
  ├─→ Send Email
  ├─→ paymentProcessing = false
  ├─→ showPaymentModal = false
  ↓
Success Alert + Navigation
```

## Security Flow

```
┌──────────────────┐
│   Frontend       │
│   (React Native) │
│                  │
│  CardField       │
│  ────────────┐   │
└─────────────┼────┘
              │ (Card data encrypted)
              │ (Sent directly to Stripe)
              ▼
    ┌──────────────────┐
    │  Stripe Servers  │
    │                  │
    │  Processes Card  │
    │  Returns Status  │
    └────────┬─────────┘
             │ (Payment status only)
             │ (No card data returned)
             ▼
┌──────────────────────────────────────────┐
│         Your Backend Server              │
│                                          │
│  Receives: Payment Status                │
│  Sends: Order Update + Email             │
└──────────────────────────────────────────┘
```

## Test Cards Reference

| Card Type | Number | Expiration | CVC | Result |
|-----------|--------|-----------|-----|--------|
| Visa Success | 4242 4242 4242 4242 | Any Future | Any 3 | ✅ Success |
| Visa Decline | 4000 0000 0000 0002 | Any Future | Any 3 | ❌ Declined |
| Visa 3D Secure | 4000 0025 0000 3155 | Any Future | Any 3 | ⚠️ 3D Auth |
| MasterCard | 5555 5555 5555 4444 | Any Future | Any 3 | ✅ Success |
| American Express | 378282246310005 | Any Future | Any 4 | ✅ Success |
| Discover | 6011 1111 1111 1117 | Any Future | Any 3 | ✅ Success |

## Expiration & CVC Rules
- **Expiration**: Can be any date in the future (MM/YY)
- **CVC**: 
  - 3 digits for Visa, Mastercard, Discover
  - 4 digits for American Express
- **Card Number**: Must pass Luhn validation

---

Generated for: Ampro React Native App
Stripe Integration: 2024
