# Supabase Migration Plan

Migrate the RAS Uniandes homepage from a custom REST API (`https://api.rasuniandes.org`) to Supabase free tier. Covers database, storage, and authentication.

**Prerequisite:** Complete `supabase-setup-checklist.md` first.

---

## Scope

| Area | Current | After migration |
|------|---------|-----------------|
| Members data | Custom REST API | Supabase PostgreSQL |
| Admin auth | Password modal → backend POST | Supabase Auth (email + password) |
| Photo storage | Multipart POST to custom API | Supabase Storage (`profile-photos` bucket) |
| IEEE events | Custom API endpoint | **Unchanged** |
| Photo display | URL prefixed with `API_URL` | Full Supabase Storage public URL |
| Initials fallback | Already implemented | No change needed |

---

## Step 1 — Install Dependency

```
npm install @supabase/supabase-js
```

---

## Step 2 — Environment Variables

Add to `.env` and `.env.production`:
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

---

## Step 3 — New File: `src/utils/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## Step 4 — New File: `src/utils/APIs/membersApi.ts`

```ts
import { supabase } from '../supabase'
import type { Member } from '../../pages/members/memberType'

export async function getActiveMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('status', 'active')
  if (error) throw error
  return data
}

export async function getPendingMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('status', 'pending')
  if (error) throw error
  return data
}

export async function approveMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .update({ status: 'active' })
    .eq('id', id)
  if (error) throw error
}

export async function submitJoinRequest(
  fields: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>,
  photoFile: File | null
): Promise<void> {
  let photoUrl: string | null = null

  if (photoFile) {
    const fileName = `${Date.now()}-${photoFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, photoFile)
    if (uploadError) throw uploadError
    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)
    photoUrl = data.publicUrl
  }

  const { error } = await supabase.from('members').insert({
    ...fields,
    photo: photoUrl,
    status: 'pending',
  })
  if (error) throw error
}
```

---

## Step 5 — Update `src/pages/members/members.tsx`

### Replace admin auth

**Remove:**
- `admin_auth_token` / `admin_auth_expiry` localStorage logic
- `axios.post(…/members/authorize)` call
- 2-hour expiry check

**Add:**
```ts
import { supabase } from '../../utils/supabase'

// Check session on load
const { data: { session } } = await supabase.auth.getSession()
const isAdmin = !!session

// Sign in (in modal submit handler)
const { error } = await supabase.auth.signInWithPassword({ email, password })

// Sign out
await supabase.auth.signOut()
```

The admin modal form gains an `email` field alongside `password`.

### Replace member fetch calls

```ts
import { getActiveMembers, getPendingMembers, approveMember } from '../../utils/APIs/membersApi'

// Instead of axios.get(…/members):
const members = await getActiveMembers()

// Instead of axios.get(…/members/to_add):
const pending = await getPendingMembers()

// Instead of axios.post(…/members/{id}/approve):
await approveMember(id)
```

---

## Step 6 — Update `src/pages/members/RequestJoinModal.tsx`

Replace the `FormData` + `axios.post(…/members/request-join)` submission with:

```ts
import { submitJoinRequest } from '../../utils/APIs/membersApi'

// In form submit handler:
await submitJoinRequest(formFields, photoFile)  // photoFile from state, or null
```

The photo file input and FileReader preview remain unchanged — only the submission changes.

---

## Step 7 — Update `src/pages/members/MemberCard.tsx`

Remove the `API_URL` prefix logic — photos are now always full public URLs:

```ts
// Remove this:
const photoUrl = member.photo?.startsWith('http')
  ? member.photo
  : `${API_URL}/${member.photo}`

// Replace with:
const photoUrl = member.photo  // already a full URL or null
```

The initials fallback (`member.name[0]`) is unchanged.

---

## What Does NOT Change

- `src/utils/APIs/IEEEApi.ts` — external IEEE events endpoint, stays on Axios
- All CSS and styling files
- `memberType.ts` interface (field names map to Supabase column names via camelCase → snake_case)
- All other pages (Home, Tools, Events, Controller, LiDAR)

---

## Verification

After implementing all steps:

1. Members page loads and shows active members from Supabase DB
2. Admin can sign in with email + password; session persists on page reload
3. Admin panel shows pending join requests
4. Approving a member sets `status = 'active'` in Supabase
5. Join request form: selecting a photo uploads it to Storage; the public URL is stored in the DB row
6. Join request without a photo stores `photo: null`; MemberCard shows initials
7. IEEE events page still works (unchanged)
8. Sign out clears the session
