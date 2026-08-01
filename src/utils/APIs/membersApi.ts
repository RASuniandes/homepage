import { supabase } from '../supabase'
import { snakeToCamelObject } from '../snakeToCamel'
import { camelToSnakeObject } from '../camelToSnake'
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

export async function rejectMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export type MemberEditableFields = Partial<Pick<Member,
  | 'name' | 'role' | 'major' | 'doubleMajor' | 'uCode' | 'phoneNumber'
  | 'project' | 'photo' | 'skills' | 'contributions' | 'goals' | 'isInCouncil'
>>

export async function updateMember(id: string, fields: MemberEditableFields): Promise<void> {
  const { error } = await supabase
    .from('members')
    .update(camelToSnakeObject(fields as Record<string, unknown>))
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

  // status and is_in_council are fixed server-side by the RPC; the client
  // cannot set them (see supabase/migrations for the hardened INSERT path).
  const { error } = await supabase.rpc('submit_join_request', {
    p_name: fields.name,
    p_email: fields.email,
    p_major: fields.major,
    p_double_major: fields.doubleMajor || null,
    p_phone_number: fields.phoneNumber || null,
    p_role: fields.role || null,
    p_u_code: fields.uCode || null,
    p_project: fields.project || null,
    p_photo: photoUrl,
    p_skills: fields.skills,
    p_contributions: fields.contributions,
    p_goals: fields.goals,
  })
  if (error) throw error
}
