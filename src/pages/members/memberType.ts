export interface Member {
  id: string
  name: string
  email: string
  role?: string
  major: string
  doubleMajor?: string
  uCode?: string
  phoneNumber?: string
  project?: string
  photo?: string
  contributions?: string[]
  skills?: string[]
  goals?: string[]
  isInCouncil: boolean
  joinDate: string
  createdAt?: string
  updatedAt?: string
}

export interface MemberCardProps {
  member: Member
  isAdmin?: boolean
  onApproved?: (memberId: string) => void
}
