import { supabase } from '../supabase'
import { snakeToCamelObject } from '../snakeToCamel'
import type { Member } from '../../pages/members/memberType'

type Row = Record<string, unknown>

function toMember(row: Row): Member {
  return snakeToCamelObject(row) as unknown as Member
}

export async function getActiveMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('status', 'active')
  if (error) throw error
  return (data as Row[]).map(toMember)
}

export async function getPendingMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('status', 'pending')
  if (error) throw error
  return (data as Row[]).map(toMember)
}

export async function approveMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .update({ status: 'active' })
    .eq('id', id)
  if (error) throw error
}

export async function submitJoinRequest(
  fields: {
    name: string
    email: string
    major: string
    doubleMajor: string
    phoneNumber: string
    role: string
    uCode: string
    project: string
    skills: string[]
    contributions: string[]
    goals: string[]
  },
  photoFile: File | null
): Promise<void> {
  let photoUrl: string | null = null

  if (photoFile) {
    const ext = photoFile.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
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
    name: fields.name,
    email: fields.email,
    major: fields.major,
    double_major: fields.doubleMajor || null,
    phone_number: fields.phoneNumber || null,
    role: fields.role || null,
    u_code: fields.uCode || null,
    project: fields.project || null,
    skills: fields.skills,
    contributions: fields.contributions,
    goals: fields.goals,
    photo: photoUrl,
    status: 'pending',
    is_in_council: false,
    join_date: new Date().toISOString(),
  })
  if (error) throw error
}
