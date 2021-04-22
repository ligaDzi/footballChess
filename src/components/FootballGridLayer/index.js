import { useEffect } from 'react'
import { Layer, Line } from 'react-konva'

import { uid } from '../../utils/helpers'

export default ({ width, height, widthCell, heightCell, grLineSize, vrtLineSize }) => {

  useEffect(() => {
    console.log(`[FootballGridLayer]:`, 'useEffect([])')
  }, [])

  const renderGrid = () => {
    const grGrid = (new Array(grLineSize)).fill(1).map((item, i) => (
      <Line 
        key={uid()}
        x={0} 
        y={i * widthCell} 
        points={[0, i * widthCell, width, i * widthCell]} 
        stroke="#dfd9d9"
        strokeWidth={2}
      />
    ))
    const vrtGrid = (new Array(vrtLineSize)).fill(1).map((item, i) => (
      <Line 
        key={uid()}
        x={i * heightCell} 
        y={0} 
        points={[i * heightCell, 0, i * heightCell, height]} 
        stroke="#dfd9d9"
        strokeWidth={2}
      />
    ))

    return grGrid.concat(vrtGrid)
  }

  return (
    <Layer x={10} y={10}>
      {renderGrid()}
    </Layer>
  )
}