import { useState, useEffect } from 'react'
import { Stage, Layer, Rect, Circle, Line } from 'react-konva'

export default () => {

  const [points, setPoints] = useState([])

  useEffect(() => {
    console.log(`points`, points)
  }, [points])

  const rect = {
    id: '123456',
    x: 50,
    y: 50,
    abrakatabra: 'Some attribute'
  }

  const handleClick = ev => {
    console.log(ev.target)
  }

  const handleCheckPoint = ev => {

    const { x, y } = ev.target.absolutePosition()
    // const x = ev.target.x()
    // const y = ev.target.y()

    const isClick = ev.target.getAttr('isClick')
    // const isClick = ev.target.attrs.

    console.log(`ev.target`, ev.target) 

    if (isClick) return

    setPoints([...points, x, y])
    ev.target.setAttr('isClick', true)
    // ev.target.attrs.isClick = true
  }

  return (
    
    <Stage width={600} height={400}>
      
      <Layer>
        <Line points={points} stroke='red' />
      </Layer>

      <Layer>
        <Rect width={50} height={50} fill="red" {...rect} onClick={handleClick} />
        
        <Circle 
          x={10} y={10} id='123456' 
          isClick={false} stroke="yellow" 
          fill='green' 
          radius={10} 
          onClick={handleCheckPoint} 
        />
        <Circle 
          x={100} y={100} id='1234567890' 
          isClick={false} 
          stroke="yellow" 
          fill='green' radius={10} 
          onClick={handleCheckPoint} 
        />
        <Circle 
          x={100} y={200} id='1234560987' 
          isClick={false} 
          stroke="yellow" 
          fill='green' 
          radius={10} 
          onClick={handleCheckPoint} 
        />
      </Layer>

    </Stage>
  );
}