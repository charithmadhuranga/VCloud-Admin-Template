import { useState } from 'react'
import { User, Settings, LogOut, Shield } from 'lucide-react'
import Dropdown, { DropdownItem } from '../ui/Dropdown'
import Avatar from '../ui/Avatar'

export default function UserDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="dropdown-toggle flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Avatar name="John Doe" size="md" />
        <span className="hidden sm:block text-xs font-medium text-text-primary">John Doe</span>
      </button>
      <Dropdown isOpen={open} onClose={() => setOpen(false)}>
        <div className="px-4 py-3 border-b border-border-default">
          <p className="text-sm font-medium text-text-primary">John Doe</p>
          <p className="text-xs text-text-tertiary">john@fleet.io</p>
        </div>
        <div className="py-1">
          <DropdownItem icon={User} onClick={() => setOpen(false)}>Profile</DropdownItem>
          <DropdownItem icon={Shield} onClick={() => setOpen(false)}>Admin Settings</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => setOpen(false)}>Account Settings</DropdownItem>
          <div className="border-t border-border-default my-1" />
          <DropdownItem icon={LogOut} danger onClick={() => setOpen(false)}>Sign Out</DropdownItem>
        </div>
      </Dropdown>
    </div>
  )
}
