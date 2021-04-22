import { useEffect, useState } from 'react'
import { Layer, Circle } from 'react-konva'

import { uid } from '../../utils/helpers'

export default ({ points, clickPoint }) => {

  useEffect(() => {
    console.log(`[DotaGridLayer]:`, 'useEffect([])')
  }, [])

  const renderPoints = () => {
    return points.map(point => (
      <Circle 
        key={uid()} 
        x={point.x} 
        y={point.y} 
        name={point.name}
        radius={3} 
        fill={point.disabled && !point.checked ? 'grey' : point.color}
        stroke={point.disabled ? 'grey' : 'grenn'} 
        onMouseEnter={!point.disabled && handleMouseEnter} 
        onMouseLeave={!point.disabled && handleMouseLeave}
        onClick={!point.disabled && handleClickPoint}
      />
    ))
  }

  const handleMouseEnter = ev => {
    ev.target.to({
      scaleX: 1.5,
      scaleY: 1.5
    })
    ev.cancelBubble = true
  }

  const handleMouseLeave = ev => {
    ev.target.to({
      scaleX: 1,
      scaleY: 1
    })
    ev.cancelBubble = true
  }

  const handleClickPoint = ev => {
    // const point = points.filter(p => p.name == ev.target.name())[0]
    // console.log('[point click]:', point)
    // console.log('[actCub]:', point.getActCub())

    clickPoint(ev)
  }

  return (
    <Layer x={10} y={10}>      
      {renderPoints()}
    </Layer>
  )
}