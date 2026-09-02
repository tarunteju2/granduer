import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8888;

// Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https:', 'http:', 'ws:', 'wss:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Enable Gzip/Brotli compression
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  })
);

// Lightweight in-memory rate limiter for API endpoints
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 30;

// Periodic cleanup of stale rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

const rateLimiter = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = rateLimitStore.get(ip);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again in a few minutes or contact concierge desk directly.',
    });
  }

  record.count += 1;
  next();
};

// Serve static assets with caching headers for fonts, textures, WebP, and icons
const distPath = path.join(__dirname, 'dist');
app.use(
  express.static(distPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (/\.(woff2|woff|ttf|otf|eot|webp|png|jpg|jpeg|svg|ico|glb|gltf|bin)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Grandeur Luxury Staffing API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Helper for reference IDs
function generateReferenceCode(prefix = 'GDR') {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomDigits}`;
}

// 1. Staffing Quote & Concierge Inquiry Endpoint
app.post(['/api/concierge/inquire', '/api/inquiries'], rateLimiter, (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    eventType,
    serviceTier,
    finishSelected,
    services,
    guestCount,
    guests,
    eventDate,
    eventTime,
    duration,
    venue,
    location,
    notes,
    specialRequirements,
  } = req.body;

  // Strict Payload Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Valid full name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const refCode = generateReferenceCode('GDR');
  const timestamp = new Date().toISOString();

  console.log(`\n[Staffing Quote Inquiry — ${refCode}]`);
  console.log(`Time: ${timestamp}`);
  console.log(`Client: ${name} ${company ? `(${company})` : ''} <${email}> ${phone ? `| Tel: ${phone}` : ''}`);
  console.log(`Event: ${eventType || 'Event'} | Date: ${eventDate || 'TBD'} | Time: ${eventTime || 'Flexible'}`);
  console.log(`Venue: ${venue || location || 'To Be Determined'}`);
  console.log(`Tier/Finish: ${serviceTier || finishSelected || 'Executive'} | Guests: ${guestCount || guests || 'N/A'}`);
  if (services && Array.isArray(services) && services.length > 0) {
    console.log(`Services Requested: ${services.join(', ')}`);
  }
  if (notes || specialRequirements) {
    console.log(`Notes: ${notes || specialRequirements}`);
  }

  return res.status(200).json({
    success: true,
    inquiryReference: refCode,
    referenceCode: refCode,
    timestamp,
    message: 'Your staffing inquiry has been registered with the executive dispatch team.',
    details: {
      client: name,
      email,
      eventType: eventType || 'Bespoke Event',
      estimatedResponseTime: 'Under 15 minutes during operating hours',
    },
  });
});

// 2. Job Application Endpoint
app.post(['/api/careers/apply', '/api/applications'], rateLimiter, (req, res) => {
  const {
    name,
    email,
    phone,
    position,
    experience,
    availability,
    about,
    resumeName,
    hasResume,
  } = req.body;

  // Strict Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Applicant name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  if (!position) {
    return res.status(400).json({ error: 'Position of interest is required.' });
  }

  const refCode = generateReferenceCode('GDR-APP');
  const timestamp = new Date().toISOString();

  console.log(`\n[Career Application — ${refCode}]`);
  console.log(`Applicant: ${name} <${email}> ${phone ? `| Tel: ${phone}` : ''}`);
  console.log(`Position: ${position} | Experience: ${experience || 'Unspecified'}`);
  console.log(`Availability: ${availability || 'Flexible'}`);
  if (about) console.log(`Summary: ${about.slice(0, 100)}...`);

  return res.status(200).json({
    success: true,
    applicationReference: refCode,
    referenceCode: refCode,
    timestamp,
    message: 'Your application has been received by Grandeur Talent Acquisition.',
    details: {
      candidate: name,
      position,
      status: 'In Review',
    },
  });
});

// Single page app fallback
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Grandeur Luxury Staffing Platform running at http://localhost:${PORT}`);
});
