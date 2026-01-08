# SendGrid Migration Tasks

## Project Overview
Migrating from Supabase + Zapier + vCita email automation to SendGrid for direct email sending.

## Current System Architecture
```
User submits form
       ↓
Frontend validation (honeypot, email regex)
       ↓
Insert into Supabase "clients" table
       ↓
Call Edge Function: /functions/v1/create-lead
       ↓
Edge Function sends data to vCita API
       ↓
vCita creates client record
       ↓
[ZAPIER AUTOMATION] watches for new vCita clients → sends email
```

## Target System Architecture
```
User submits form
       ↓
Frontend validation (honeypot, email regex)
       ↓
Insert into Supabase "clients" table
       ↓
Call Edge Function: /functions/v1/send-email (NEW)
       ↓
Edge Function sends email via SendGrid API
       ↓
Email delivered directly to business owner
```

---

## Migration Tasks

### Phase 1: Setup & Testing (No Breaking Changes)
- [ ] Get SendGrid API key and verify account
- [ ] Create new Supabase Edge Function for SendGrid (`send-email`)
- [ ] Test SendGrid function independently (not connected to form yet)
- [ ] Verify email delivery works

### Phase 2: Parallel Running (Both Systems Active)
- [ ] Modify Consultation.tsx to call BOTH vCita AND SendGrid functions
- [ ] Test form submission - should create vCita client AND send SendGrid email
- [ ] Verify both emails arrive (Zapier email + SendGrid email)
- [ ] Monitor for any issues over a few submissions

### Phase 3: Switch Over
- [ ] **USER ACTION:** Turn off Zapier automation
- [ ] Test that SendGrid emails still arrive
- [ ] Confirm vCita client creation still works (for CRM purposes)

### Phase 4: Cleanup (Optional)
- [ ] Decide if vCita integration is still needed
- [ ] If not needed, remove create-lead Edge Function
- [ ] Update environment variables documentation
- [ ] Update Privacy Policy if data handling changes

---

## SendGrid Configuration

### Required Supabase Secrets
```
SENDGRID_API_KEY=SG.xxxx (your API key)
NOTIFICATION_EMAIL=your-business-email@example.com
FROM_EMAIL=noreply@yourdomain.com (optional, defaults to noreply@livelylighting.com)
```

### API Endpoint (handled by Edge Function)
```
https://api.sendgrid.com/v3/mail/send
```

---

## How SendGrid Works (Layman's Terms)

SendGrid is an email delivery service - think of it like a postal service for emails.

**The Simple Version:**
1. Your website collects form data
2. Your code packages that data into an email format
3. You send that package to SendGrid's servers via their API
4. SendGrid delivers the email to the recipient's inbox

**Why use it instead of sending directly?**
- Email servers are picky - they block emails from unknown sources
- SendGrid has "trusted sender" status with email providers
- Better delivery rates (less likely to land in spam)
- Handles all the technical email stuff (DKIM, SPF, etc.)

**The API Call:**
```
Your Server → "Hey SendGrid, send this email"
SendGrid → "Got it, delivering now"
SendGrid → Recipient's inbox
```

---

## Files to Modify

| File | Change |
|------|--------|
| `supabase/functions/send-email/index.ts` | NEW - SendGrid integration |
| `src/components/Consultation/Consultation.tsx` | Add call to new function |
| `.env.example` | Add SendGrid variables |
| `supabase/.env` (or secrets) | Add SendGrid API key |

---

## Testing Checklist

### Before Going Live
- [ ] Test email sends successfully
- [ ] Test email formatting looks correct
- [ ] Test all form fields appear in email
- [ ] Test error handling (what happens if SendGrid fails?)
- [ ] Test spam folder (emails should NOT go to spam)

### After Disabling Zapier
- [ ] Confirm NO duplicate emails
- [ ] Confirm email still arrives
- [ ] Confirm vCita still creates clients (if keeping that)

---

## Rollback Plan

If SendGrid has issues:
1. Re-enable Zapier automation
2. Comment out SendGrid function call in Consultation.tsx
3. System reverts to original behavior

---

## Session Notes

*Add notes here as we progress:*

- **Session 1 (2026-01-08):** Explored codebase, created migration plan
- **Session 2 (2026-01-08):** Created SendGrid Edge Function (`supabase/functions/send-email/index.ts`)
- **Next Step:** Add Supabase secrets and test the function
