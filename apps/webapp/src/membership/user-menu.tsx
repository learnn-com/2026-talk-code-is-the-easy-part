import { LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from './auth-provider'
import { UserAvatar } from './user-avatar'

export function UserMenu() {
  const { session, logout } = useAuth()
  if (!session) return null
  const { name, photoUrl } = session.user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Menu utente: ${name}`}
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <UserAvatar name={name} photoUrl={photoUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel data-testid="user-name" className="truncate" title={name}>
          {name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <LogOut aria-hidden className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
