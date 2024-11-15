const express = require('express');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 10, // Limit each IP to 3 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(limiter)

app.use(
    '/flightsService',createProxyMiddleware({
        target: ServerConfig.FLIGHT_SERVICE,
        changeOrigin: true,
        // pathFilter: '/api/proxy-only-this-path',
    }),
);

app.use(
    '/bookingService', createProxyMiddleware({
        target: ServerConfig.BOOKING_SERVICE,
        changeOrigin: true,
        // pathFilter: '/api/proxy-only-this-path',
    }),
);
app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
