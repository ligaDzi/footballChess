import { useEffect } from 'react'
import { Layer, Line } from 'react-konva'


import { uid } from '../../utils/helpers'

export default ({ markup }) => {
  useEffect(() => {
    console.log(`[MarkupLayer]:`, 'useEffect([])')
  }, [])

  const renderMarkup = () => {
    const { halfField, centralDistrict, homePortal, guestPortal, homePenaltyArea, guestPenaltyArea, sideLines } = markup
    const colorLine = '#d4d4d4'
    return (
      <>
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={halfField} 
          stroke={colorLine}
          strokeWidth={6}
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={homePenaltyArea} 
          stroke={colorLine}
          strokeWidth={6}
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={guestPenaltyArea} 
          stroke={colorLine}
          strokeWidth={6}
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={centralDistrict} 
          stroke={colorLine}
          strokeWidth={6}
          closed
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={sideLines} 
          stroke={colorLine}
          strokeWidth={6}
          closed
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={homePortal.first} 
          stroke="black"
          strokeWidth={6}
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={homePortal.last} 
          stroke="black"
          strokeWidth={6}
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={guestPortal.first} 
          stroke="black"
          strokeWidth={6}
        />
        <Line 
          key={uid()}
          x={0} 
          y={0} 
          points={guestPortal.last} 
          stroke="black"
          strokeWidth={6}
        />
      </>
    )
  }

  return (
    <Layer x={10} y={10}>
      {renderMarkup()}
    </Layer>
  )
}