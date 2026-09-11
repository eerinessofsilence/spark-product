import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

type ChromeState = {
  /** Mobile menu, opened from the hero header and rendered by the floating nav. */
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  /** Set by a full-screen section that carries its own top row, e.g. the flow stage. */
  navHidden: boolean
  setNavHidden: Dispatch<SetStateAction<boolean>>
}

/** Page chrome state, shared by the hero header, the floating nav and full-screen sections. */
export const MenuContext = createContext<ChromeState>({
  open: false,
  setOpen: () => {},
  navHidden: false,
  setNavHidden: () => {},
})

export function useMenu() {
  return useContext(MenuContext)
}
