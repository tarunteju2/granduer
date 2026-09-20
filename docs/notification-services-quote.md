# Grandeur Staffing Platform

## Notification Services Cost Quote

**Document Version:** 1.0  
**Date:** September 18, 2026  
**Prepared For:** Grandeur Executive Team  
**Valid Until:** October 18, 2026

---

## Executive Summary

This document outlines the recommended infrastructure and associated costs for implementing a dual-channel notification system to deliver real-time alerts when new client inquiries are submitted through the Grandeur Staffing Platform. The system will dispatch both **Email notifications** and **SMS/Text Message notifications** in parallel, ensuring zero missed opportunities for client engagement.

---

## 1. Email Notification Service

### Recommended Provider: Resend

| Plan Tier | Monthly Cost | Monthly Volume | Per-Email Cost | Best For |
|-----------|-------------|----------------|----------------|----------|
| **Free** | $0 | 3,000 emails | $0.00 | Testing / Low volume |
| **Pay-as-you-go** | Variable | 100,000 emails | $0.0035 | 1–100K inquiries/month |
| **Pro** | $20/mo | 50,000 emails | $0.0004 | 50K+ monthly inquiries |

**Additional Costs:**

| Service | Cost |
|---------|------|
| Dedicated IP (optional) | $15/month |
| Custom Domain Authentication | Included |
| Email Template Design | $500 (one-time) |
| Analytics Dashboard | Included |

**Implementation Estimate:**

- API integration: 4–6 hours
- Template customization: 2–3 hours
- Testing & deployment: 1–2 hours
- **Total Implementation:** 7–11 hours ($700–$1,100 at standard rates)

---

## 2. SMS/Text Message Service

### Recommended Provider: Twilio

| Plan Tier | Monthly Cost | Monthly Volume | Per-SMS Cost | Per-MMS Cost |
|-----------|-------------|----------------|--------------|--------------|
| **Pay-as-you-go** | $0 | No minimum | $0.0079 | $0.0200 |
| **Basic** | $25/mo | 500 included | $0.0075 | $0.0200 |
| **Standard** | $75/mo | 2,500 included | $0.0065 | $0.0180 |
| **Volume** | Custom | Custom | Negotiated | Negotiated |

**Short Codes & Long Numbers:**

| Service | One-Time Setup | Monthly Cost |
|---------|---------------|--------------|
| Toll-Free Number | $500 | $25/month |
| Short Code (6-digit) | $1,500 | $100/month |
| Alphanumeric Sender ID | $0 | $0.02/SMS (no replies) |

**Implementation Estimate:**

- API integration: 6–8 hours
- Number provisioning & verification: 2–4 hours
- Message template configuration: 2 hours
- Testing & compliance review: 2–3 hours
- **Total Implementation:** 12–17 hours ($1,200–$1,700 at standard rates)

---

## 3. Alternative SMS Providers

For cost optimization or redundancy, consider:

### Provider Comparison

| Provider | Per-SMS | Setup Fee | Pros |
|----------|---------|-----------|------|
| **Twilio** | $0.0079 | $0 | Industry standard, reliable, global coverage |
| **MessageBird** | $0.0065 | $0 | Competitive pricing, good APIs |
| **Plivo** | $0.0060 | $0 | Lowest cost, US-focused |
| **Vonage** | $0.0085 | $0 | Strong enterprise features |
| **Nexmo (Vonage)** | $0.0070 | $0 | Good deliverability |

**Recommendation:** Start with Twilio pay-as-you-go for flexibility; upgrade to Standard plan as volume grows.

---

## 4. Combined Notification Architecture

### Recommended Setup

```
┌─────────────────────┐
│  Client Submits     │
│  Inquiry Form       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Express API        │
│  (server.js)        │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌───────┐  ┌───────┐
│ Email │  │  SMS  │
│ API   │  │  API  │
└───┬───┘  └───┬───┘
    │          │
    ▼          ▼
┌───────┐  ┌───────┐
│Resend │  │Twilio │
└───────┘  └───────┘
    │          │
    ▼          ▼
┌─────────────┴─────────────┐
│  Grandeur Team Notified   │
│  (Email + SMS in parallel)│
└───────────────────────────┘
```

### Parallel Dispatch Logic (Pseudocode)

```javascript
// Fire both notifications simultaneously
Promise.all([
  sendEmailNotification(inquiryData),
  sendSMSNotification(inquiryData)
]).then(([emailResult, smsResult]) => {
  console.log('Both notifications dispatched');
  console.log('Email:', emailResult.status);
  console.log('SMS:', smsResult.status);
}).catch((error) => {
  // Log failure, implement retry queue
  console.error('Notification failed:', error);
});
```

---

## 5. Cost Projections

### Scenario A: Low Volume (Under 50 inquiries/month)

| Service | Monthly Cost |
|---------|-------------|
| Email (Resend Pay-as-you-go) | ~$5–$15 |
| SMS (Twilio Pay-as-you-go) | ~$5–$15 |
| **Total Monthly** | **$10–$30** |

### Scenario B: Medium Volume (50–200 inquiries/month)

| Service | Monthly Cost |
|---------|-------------|
| Email (Resend Pro) | $20 |
| SMS (Twilio Standard) | $75 |
| **Total Monthly** | **$95** |

### Scenario C: High Volume (200–500 inquiries/month)

| Service | Monthly Cost |
|---------|-------------|
| Email (Resend Pro + overage) | $20–$35 |
| SMS (Twilio Standard + overage) | $75–$100 |
| **Total Monthly** | **$95–$135** |

### Implementation & Setup (One-Time)

| Item | Cost |
|------|------|
| Email Integration | $700–$1,100 |
| SMS Integration | $1,200–$1,700 |
| Testing & QA | $300–$500 |
| Documentation | $200–$300 |
| **Total Setup** | **$2,400–$3,600** |

---

## 6. Recommended Package

### Tier 1: Startup Package

| Item | Cost |
|------|------|
| Resend Pay-as-you-go (email) | $0/month |
| Twilio Pay-as-you-go (SMS) | $0/month |
| Implementation & Integration | $2,400 |
| **Total Initial Investment** | **$2,400** |
| **Estimated Monthly (50 inquiries)** | **~$25/month** |

### Tier 2: Professional Package (Recommended)

| Item | Cost |
|------|------|
| Resend Pro | $20/month |
| Twilio Standard | $75/month |
| Implementation & Integration | $3,200 |
| **Total Initial Investment** | **$3,200** |
| **Estimated Monthly (150 inquiries)** | **$95/month** |

### Tier 3: Enterprise Package

| Item | Cost |
|------|------|
| Resend Pro + Dedicated IP | $35/month |
| Twilio Standard + Short Code | $175/month |
| Implementation & Integration | $3,600 |
| **Total Initial Investment** | **$3,600** |
| **Estimated Monthly (300+ inquiries)** | **$210/month** |

---

## 7. Add-On Services

| Service | One-Time | Monthly |
|---------|----------|---------|
| Slack Integration (team alerts) | $500 | $0 |
| Push Notifications (browser) | $300 | $0 |
| CRM Integration (Salesforce/HubSpot) | $1,500 | $50 |
| Analytics Dashboard Customization | $800 | $0 |
| Automated Follow-up Sequences | $600 | $25 |
| Multi-Language Notifications | $400 | $0 |

---

## 8. Compliance & Considerations

### Email Compliance
- GDPR compliance for EU contacts: Included
- CAN-SPAM compliance: Included
- Unsubscribe handling: Automatic via Resend

### SMS Compliance
- TCPA compliance (USA): Required consent capture
- Carrier filtering risks: Mitigated via verified numbers
- Opt-out handling: Automatic keyword processing (STOP)
- Short code registration: 8–12 weeks lead time

### Data Security
- All data transmitted via HTTPS/TLS
- API keys stored as environment variables
- No client data stored on third-party servers (transit only)

---

## 9. Implementation Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Provider account setup & verification | 1–2 days |
| 2 | API key configuration & secure storage | 1 day |
| 3 | Email notification service integration | 1 day |
| 4 | SMS notification service integration | 2 days |
| 5 | Parallel dispatch logic implementation | 1 day |
| 6 | Template design & personalization | 2 days |
| 7 | Testing (staging environment) | 2 days |
| 8 | UAT & deployment | 1 day |
| **Total** | | **10–12 business days** |

---

## 10. Next Steps

1. **Select Package Tier** — Recommend Tier 2 (Professional) for immediate needs with growth potential
2. **Approve Implementation Scope** — Review hours and timeline
3. **Provider Accounts** — Create accounts with Resend and Twilio
4. **Kickoff Meeting** — Schedule technical discovery call
5. **Development Begins** — Upon approval and account provisioning

---

## Contact

For questions regarding this quote, please contact your Account Executive.

**Quote Valid For:** 30 days from date above  
**Payment Terms:** 50% upon project commencement, 50% upon delivery  
**Currency:** USD

---

*This document contains confidential pricing information intended solely for the recipient.*
