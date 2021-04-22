import { Layer, Line } from 'react-konva'

export default ({ steps, kickList }) => {

  const renderSteps = () => {
    return steps.map(step => (      
      <Line 
        key={step.id} 
        points={step.points} 
        stroke={step.colorTeam}
        strokeWidth={2}
      />
    ))
  }

  const renderKickList = () => {
    return kickList.map(kick => (
      <Line 
        key={kick.id} 
        points={kick.points} 
        stroke={kick.colorTeam}
        strokeWidth={1}
        dash={[4, 4]}
      />
    ))
  }

  return (
    <Layer x={10} y={10}>
      {renderSteps()}
      {renderKickList()}
    </Layer>
  )
}