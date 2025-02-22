import express from 'express';
import { handleSubscriptionSuccess } from './api/subscription-success';
import { handleCheckoutSession } from './api/create-checkout-session';

const app = express();
app.use(express.json());

// Subscription endpoints
app.post('/api/subscription-success', handleSubscriptionSuccess);
app.post('/api/create-checkout-session', handleCheckoutSession);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 