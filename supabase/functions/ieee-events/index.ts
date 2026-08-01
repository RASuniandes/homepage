// Proxies the IEEE vTools public events API.
//
// vTools (https://events.vtools.ieee.org) doesn't send
// Access-Control-Allow-Origin headers, so the browser can't call it
// directly -- this function fetches it server-side and applies the same
// filters the old FastAPI backend did (vTools itself only supports
// limit/page/published natively; everything else is filtered here).
//
// Single-file on purpose: the Supabase dashboard's function editor doesn't
// support the multi-file `../_shared/cors.ts` import the CLI deploy path
// does, so CORS handling is inlined below instead.
//
// Deploy: supabase functions deploy ieee-events

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const VTOOLS_URL = 'https://events.vtools.ieee.org/RST/events/api/public/v7/events/list'

interface EventAttributes {
  title?: string
  'location-type'?: string
  cancelled?: boolean
  cost?: boolean
  'start-time'?: string
  city?: string
  tags?: string[]
  keywords?: string
  [key: string]: unknown
}

interface VtoolsEvent {
  attributes?: EventAttributes
  [key: string]: unknown
}

interface Filters {
  title?: string
  location_type?: string
  cancelled?: boolean
  cost?: boolean
  start_time_after?: string
  start_time_before?: string
  city?: string
  tags?: string
  keywords?: string
}

function filterEvents(events: VtoolsEvent[], f: Filters): VtoolsEvent[] {
  let filtered = events

  if (f.title) {
    const q = f.title.toLowerCase()
    filtered = filtered.filter(e => (e.attributes?.title ?? '').toLowerCase().includes(q))
  }
  if (f.location_type) {
    filtered = filtered.filter(e => e.attributes?.['location-type'] === f.location_type)
  }
  if (f.cancelled !== undefined) {
    filtered = filtered.filter(e => e.attributes?.cancelled === f.cancelled)
  }
  if (f.cost !== undefined) {
    filtered = filtered.filter(e => e.attributes?.cost === f.cost)
  }
  if (f.start_time_after) {
    filtered = filtered.filter(e => (e.attributes?.['start-time'] ?? '') >= f.start_time_after!)
  }
  if (f.start_time_before) {
    filtered = filtered.filter(e => (e.attributes?.['start-time'] ?? '') <= f.start_time_before!)
  }
  if (f.city) {
    const q = f.city.toLowerCase()
    filtered = filtered.filter(e => (e.attributes?.city ?? '').toLowerCase().includes(q))
  }
  if (f.tags) {
    const wanted = f.tags.split(',').map(t => t.trim())
    filtered = filtered.filter(e => (e.attributes?.tags ?? []).some(t => wanted.includes(t)))
  }
  if (f.keywords) {
    const q = f.keywords.toLowerCase()
    filtered = filtered.filter(e => (e.attributes?.keywords ?? '').toLowerCase().includes(q))
  }

  return filtered
}

function toBool(v: unknown): boolean | undefined {
  if (v === undefined || v === null || v === '') return undefined
  if (typeof v === 'boolean') return v
  return String(v).toLowerCase() === 'true'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    let params: Record<string, unknown> = Object.fromEntries(url.searchParams)

    if (req.method === 'POST') {
      try {
        const body = await req.json()
        if (body && typeof body === 'object') params = { ...params, ...body }
      } catch {
        // no/invalid JSON body -- fall back to query params only
      }
    }

    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10))
    const page = Math.max(1, Number(params.page) || 1)
    const published = params.published === undefined ? true : toBool(params.published) ?? true

    const upstream = new URL(VTOOLS_URL)
    upstream.searchParams.set('limit', String(limit))
    upstream.searchParams.set('page', String(page))
    upstream.searchParams.set('published', String(published))

    let upstreamRes: Response
    try {
      // vTools has been observed to hang (not error) instead of responding --
      // fail fast rather than let the function run until the platform kills it.
      upstreamRes = await fetch(upstream.toString(), { signal: AbortSignal.timeout(15000) })
    } catch (err) {
      const timedOut = err instanceof Error && err.name === 'TimeoutError'
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch IEEE events',
          details: timedOut ? 'upstream request to vTools timed out after 15s' : String(err),
        }),
        { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }
    if (!upstreamRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch IEEE events', details: `upstream status ${upstreamRes.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const apiData = await upstreamRes.json()
    const rawEvents: VtoolsEvent[] = apiData.data ?? []

    // vTools' own `total` field doesn't reliably reflect the real dataset
    // size (observed returning 0 with real data present), so pagination
    // can't trust it. Instead, treat a full page as "there might be more":
    // if vTools handed back fewer than we asked for, this was the last page.
    const hasMore = rawEvents.length === limit
    const pages = hasMore ? page + 1 : page
    const knownCount = (page - 1) * limit + rawEvents.length

    const events = filterEvents(rawEvents, {
      title: params.title as string | undefined,
      location_type: params.location_type as string | undefined,
      // matches the old backend's default: cancelled events are hidden
      // unless the caller explicitly asks to include them
      cancelled: toBool(params.cancelled) ?? false,
      cost: toBool(params.cost),
      start_time_after: params.start_time_after as string | undefined,
      start_time_before: params.start_time_before as string | undefined,
      city: params.city as string | undefined,
      tags: params.tags as string | undefined,
      keywords: params.keywords as string | undefined,
    })

    return new Response(
      JSON.stringify({
        data: {
          events,
          pagination: {
            per_page: limit,
            total: knownCount,
            pages,
            total_amount: knownCount,
          },
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch IEEE events', details: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
