import { createContext } from "react"
import useStickyState from "../lib/useStickyState"

export const ViewModeContext = createContext()

export function ViewModeProvider({children}){
  let [ viewMode, setViewMode ] = useStickyState('grid', 'viewMode')

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }} >
      {children}
    </ViewModeContext.Provider>
  )
}

