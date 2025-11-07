import React from 'react'
import { Box } from '@mui/material'

export const Header = () => {
  return (
    <Box 
        component="header"
        className="w-full h-[60px] flex items-center justify-center bg-[#2D6A4F] shadow-sm text-lg font-semibold text-white"
    > 
        Temp - CornShield AI
    </ Box>
  )
}
