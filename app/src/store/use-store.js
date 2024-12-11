// src/hooks/use-stores.tsx
import React from 'react'
import { storesContext } from './initializeStore'

export const useStore = () => React.useContext(storesContext)
