import React from 'react'

interface Props {
  currentValue: number
  maxValue: number
  updatedQuantity: (maxValue: number) => void
  style: any
}

export const ItemCounter: React.FC<Props> = ({ currentValue, updatedQuantity, maxValue, style }) => {
  
  const addOrRemove = ( value: number ) => {
    if ( value === -1 ) {
      if ( currentValue === 1 ) return

      return updatedQuantity( currentValue - 1 )
    }

    if ( currentValue >= maxValue ) return

    updatedQuantity( currentValue + 1 )
  }
  
  return (
    <div className='h-[45px] w-fit flex justify-between' style={{ border: `1px solid ${style?.primary}`, borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>
      <button className='pl-4 pr-6 text-sm' style={{ color: style?.primary }} onClick={ () => addOrRemove(-1) }>-</button>
      <span className='mt-auto mb-auto w-4 text-center text-sm' style={{ color: style?.primary }}>{ currentValue }</span>
      <button className='pl-6 pr-4 text-sm' style={{ color: style?.primary }} onClick={ () => addOrRemove(+1) }>+</button>
    </div>
  )
}
