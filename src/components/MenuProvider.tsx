import { useMemo, useState, type ReactNode } from 'react'
import { MenuContext } from '../lib/menu'

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const value = useMemo(() => ({ open, setOpen, navHidden, setNavHidden }), [open, navHidden])
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
