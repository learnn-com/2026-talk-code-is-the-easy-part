import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from './get-initials'

export function UserAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const initials = getInitials(name)
  return (
    <Avatar>
      {photoUrl && <AvatarImage src={photoUrl} alt="" />}
      <AvatarFallback>{initials || <User aria-hidden className="size-4" />}</AvatarFallback>
    </Avatar>
  )
}
