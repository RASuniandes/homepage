# Supabase Setup Checklist

Complete these steps in the Supabase dashboard **before** starting the code migration.

---

## 1. Create Project

- [ ] Go to https://supabase.com and create a new project (free tier)
- [ ] Note your **Project URL** → set as `VITE_SUPABASE_URL` in `.env`
- [ ] Note your **anon/public key** → set as `VITE_SUPABASE_ANON_KEY` in `.env`

---

## 2. Create `members` Table

Go to **Table Editor > New Table**. Name: `members`. Disable RLS for now (we'll enable it after).

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | uuid | `gen_random_uuid()` | Primary key |
| `name` | text | — | Not null |
| `email` | text | — | Not null |
| `role` | text | — | |
| `major` | text | — | Not null |
| `double_major` | text | — | |
| `u_code` | text | — | University code |
| `phone_number` | text | — | |
| `project` | text | — | |
| `photo` | text | — | Supabase Storage public URL |
| `contributions` | text[] | `'{}'` | |
| `skills` | text[] | `'{}'` | |
| `goals` | text[] | `'{}'` | |
| `is_in_council` | bool | `false` | |
| `status` | text | `'pending'` | Values: `'active'` or `'pending'` |
| `join_date` | timestamptz | — | |
| `created_at` | timestamptz | `now()` | |
| `updated_at` | timestamptz | `now()` | |

---

## 3. Enable Row Level Security (RLS)

Go to **Authentication > Policies**, select the `members` table, and enable RLS. Then add these policies:

### Policy 1 — Public read of active members
- **Name:** `Public read active members`
- **Operation:** SELECT
- **Target roles:** `anon`, `authenticated`
- **USING expression:** `status = 'active'`

### Policy 2 — Authenticated read of pending members
- **Name:** `Admin read pending members`
- **Operation:** SELECT
- **Target roles:** `authenticated`
- **USING expression:** `status = 'pending'`

> Note: Because Policy 1 only covers `status = 'active'`, authenticated users can see both active (via Policy 1) and pending (via Policy 2).

### Policy 3 — Public insert (join requests)
- **Name:** `Public submit join request`
- **Operation:** INSERT
- **Target roles:** `anon`, `authenticated`
- **WITH CHECK expression:** `status = 'pending'`

### Policy 4 — Authenticated update (approve/reject)
- **Name:** `Admin approve members`
- **Operation:** UPDATE
- **Target roles:** `authenticated`
- **USING expression:** `true`

---

## 4. Create Storage Bucket

Go to **Storage > New Bucket**:

- **Bucket name:** `profile-photos`
- **Public bucket:** ✅ Yes (so photo URLs work without auth tokens)

Then add a storage policy (Storage > Policies > profile-photos):

### Storage Policy — Public upload
- **Operation:** INSERT
- **Target roles:** `anon`, `authenticated`
- **USING/CHECK:** `true`

### Storage Policy — Public read
- **Operation:** SELECT
- **Target roles:** `anon`, `authenticated`
- **USING:** `true`

---

## 5. Create Admin User

Go to **Authentication > Users > Invite user** (or Add user):

- Email: _(admin email address)_
- Password: _(strong password)_

This is the account used to log into the admin panel on the members page.

---

## 6. (Optional) Migrate Existing Data

If migrating existing members from the current API at `https://api.rasuniandes.org`:

- [ ] Export member data from current backend
- [ ] Download photos locally
- [ ] Upload photos to Supabase Storage (`profile-photos` bucket)
- [ ] Update `photo` fields with new Supabase Storage public URLs
- [ ] Import rows into `members` table (via Supabase Table Editor CSV import or SQL)

---

## 7. Copy Credentials to `.env`

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

Keep the existing:
```
VITE_API_URL=https://api.rasuniandes.org   # still used for IEEE events
```

---

Once all boxes above are checked, proceed with the code migration (see `supabase-migration-plan.md`).
