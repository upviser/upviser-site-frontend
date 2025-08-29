import React, { PropsWithChildren } from 'react'

interface Props {
  style: any
}

export const ButtonNone: React.FC<PropsWithChildren<Props>> = ({ children, style }) => {
  return (
    <button className='py-3 w-full min-w-60 transition-all duration-200 h-fit cursor-not-allowed 450:w-56' style={{ backgroundColor: `${style?.primary}99`, color: style?.button, borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>
      { children }
    </button>
  )
}
