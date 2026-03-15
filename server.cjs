require('dotenv').config();
const express = require('express');
const { handler, healthHandler } = require('./resend_backend.cjs');

const app = express();
app.use(express.json());

// Adapt Express req/res to Lambda event/response shape
function lambdaAdapter(lambdaFn) {
  return async (req, res) => {
    const event = {
      httpMethod: req.method,
      body: JSON.stringify(req.body),
      headers: req.headers,
    };
    const result = await lambdaFn(event, {});
    res.status(result.statusCode).set(result.headers).send(result.body);
  };
}

app.options('/api/contact', lambdaAdapter(handler));
app.post('/api/contact', lambdaAdapter(handler));
app.options('/api/health', lambdaAdapter(healthHandler));
app.get('/api/health', lambdaAdapter(healthHandler));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
