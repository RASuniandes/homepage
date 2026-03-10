/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IEEE vTools Events API v7 - Event Object
 */
export interface IEEEEventResponse {
  type: 'events'
  id: string // The event ID as a string (per JSON:API spec)
  attributes: IEEEEventAttributes
}

export interface IEEEEventAttributes {
  id: number // The internal numeric event ID
  title: string
  description: string
  'start-time': string // ISO 8601 format
  'end-time': string // ISO 8601 format
  'time-zone': IEEETimeZone
  'primary-host': IEEEPrimaryHost
  cohosts: string[]
  header: string | null
  footer: string | null
  keywords: string // Typically space-separated tags like " #teamwork"
  tags: string[]
  agenda: string | null
  'contact-email': string
  'contact-display': string
  'cosponsor-name': string
  'location-type': HTMLElement | 'physical' | 'virtual' | 'hybrid'
  'virtual-info': string | null
  address1: string
  address2: string
  city: string
  'postal-code': string
  building: string
  'room-number': string
  'map-url': string
  latitude: string
  longitude: string
  image: string | null
  'image-mime-type': string | null
  'registration-start-time': string | null
  'registration-end-time': string | null
  'registration-url': string
  'enable-cohost-url': boolean
  'cohost-url': string | null
  'survey-url': string
  cost: boolean
  'max-registrations': number
  cancelled: boolean
  uid: string
  publish: boolean
  virtual: boolean
  link: string // Full URL to view event on vTools
  'ieee-attending': number | null
  'guests-attending': number | null
  'created-at': string // ISO 8601
  'updated-at': string // ISO 8601
  pricing: any | null // Structure varies by event
  speakers: any | null // Structure varies by event
  media: any | null
  'enhanced-report': any | null
}

export interface IEEETimeZone {
  name: string // e.g., "America/New_York"
  'utc-offset': string // e.g., "-04:00"
}

export interface IEEEPrimaryHost {
  spoid: string // Organizational unit ID (e.g., "R00173")
  name: string // Display name (e.g., "Bhubaneswar Section Chapter IA34")
  class_code: string // e.g., "SUBT"
  class_description: string // e.g., "Technical SPO"
  type_code: string // e.g., "CHPT"
  type_description: string // e.g., "Chapter"
  section_spoids: string
  region_spoids: string
  society_spoids: string
  report_submitted: string | boolean | null
  report_updated: string | null
}

/**
 * Wrapper for the paginated list response
 */
export interface IEEEEventListResponse {
  events: IEEEEventResponse[]
  links?: {
    self: string
    next?: string
    prev?: string
  }
  meta?: {
    total: number
    count: number
    limit: number
    offset: number
  }
}
