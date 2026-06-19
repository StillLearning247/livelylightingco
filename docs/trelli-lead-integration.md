# Trelli Lead Integration — Activation Checklist

Dual-writes website leads into **Trelli** (our own CRM at `trellicrm.com`) alongside
the existing vCita push, during the vCita → Trelli migration. Once we trust Trelli,
we drop the vCita push and this becomes the only CRM destination.

## How it works

- Every consultation-form submission already calls the Supabase edge function
  `create-lead`.
- `create-lead` now pushes the lead to **both** vCita and Trelli.
- The Trelli push is **non-fatal and independent**: it runs before the vCita call,
  any failure is logged but never thrown, and it's skipped entirely if
  `TRELLI_API_KEY` is unset. A vCita outage does not stop Trelli from receiving the
  lead, and a Trelli outage does not break the contact form.
- Trelli ingests via its public lead API: `POST https://trellicrm.com/api/v1/leads`
  with an `X-API-Key` header (scope `leads:write`). Trelli creates a Contact with
  `status: "lead"`, dedupes on email (returns `409`, which we treat as success),
  and emails the org admins.

## Field mapping (LLC form → Trelli)

| LLC form field | Trelli field | Notes |
|----------------|--------------|-------|
| `first_name`   | `firstName`  | |
| `last_name`    | `lastName`   | |
| `email`        | `email`      | dedup key |
| `phone`        | `phone`      | |
| —              | `source`     | hardcoded `"livelylighting.com"` |
| `address`      | `notes`      | folded into notes (Trelli lead API has no address field) |
| `lead_source`  | `notes`      | "How they heard about us: …" |
| `sales_code`   | `notes`      | "Sales code: …" (uppercased) |
| `message`      | `notes`      | "Message: …" |

## Activation steps

### 1. In Trelli (one-time, UI only — no code change)
- [ ] Sign in to `trellicrm.com` as the LivelyLighting org admin.
- [ ] Settings → API keys → create a key named e.g. `LivelyLighting Website`.
- [ ] Grant **only** the `leads:write` scope.
- [ ] Copy the key (shown once) — it looks like `trelli_…`.

### 2. In Supabase (LLC project)
- [ ] Dashboard → Edge Functions → secrets (or `supabase secrets set`):
  - `TRELLI_API_KEY=trelli_…`
  - `TRELLI_API_URL=https://trellicrm.com/api/v1/leads` (optional; this is the default)
- [ ] Redeploy the function: `supabase functions deploy create-lead`

### 3. Smoke test
- [ ] Submit the consultation form on the live site with a fresh test email.
- [ ] Confirm the lead appears in Trelli (Contacts, status = lead) within a few seconds.
- [ ] Confirm it also still appears in vCita (dual-write intact).
- [ ] Confirm the org-admin "New Lead Received" email **physically arrives** from
      Trelli. NOTE: a `201` from the lead push does **not** prove the email sent —
      Trelli's admin-notification send is wrapped in a never-throwing try/catch, so
      a Resend/from-domain failure is invisible and still returns `201`. The only
      proof is the email landing in the inbox. Do not suppress SendGrid until you've
      seen a real Trelli email with your own eyes.
- [ ] Re-submit with the same email → Trelli logs a `409` (no duplicate), form still succeeds.
- [ ] Check `create-lead` function logs for `Trelli lead created` / `Trelli push skipped`.

## Rollback / disable

- Remove (or blank) the `TRELLI_API_KEY` secret and redeploy `create-lead`. The push
  is skipped silently; vCita is unaffected.

## Cutover (later — when Trelli is trusted)

- Stop the vCita push: in `create-lead`, remove the vCita block (and the
  `Missing required vCita configuration` guard), leaving only `pushToTrelli`.
- Remove the `VCITA_*` secrets and the legacy vCita references.

## Reference

- Edge function: `supabase/functions/create-lead/index.ts`
- Trelli lead endpoint (in CRM repo): `app/api/v1/leads/route.ts`
- Trelli API-key auth/scopes (in CRM repo): `lib/api-middleware.ts`, `lib/api-keys.ts`
</content>
</invoke>
