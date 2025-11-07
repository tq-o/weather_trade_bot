import React from 'react'
import { Box } from '@mui/material'

export const Header = () => {
  return (
    <Box 
        component="header"
        className="w-full h-[4rem] flex items-center justify-center bg-[#2D6A4F] shadow-sm text-4xl font-semibold text-white"
    > 
        Temp
    </ Box>
  )
}
