import { useState, useEffect } from 'react'

import FootballGridLayer from '../FootballGridLayer'
import MarkupLayer from '../MarkupLayer'
import DotaGridLayer from '../DotaGridLayer'
import StepLayer from '../StepLayer'

import { PointCls, PortalPointCls, CentralDistrictCls, GoalPostCls, StartPointCls } from '../../utils/PointCls'
import GameCls from '../../utils/GameCls'
import MatchReportCls from '../../utils/MatchReportCls'
import BallCls from '../../utils/BallCls'
import TeamCls from '../../utils/TeamCls'
import RefereeCls from '../../utils/RefereeCls'

import { halfEnum } from '../../utils/helpers'


export default ({ width, height }) => {
  const grzLineCount = 37
  const vrtLineCount = 29
  const widthCell = Math.round(height/grzLineCount)
  const heightCell = Math.round(width/vrtLineCount)

  const [game, setGame] = useState(null)
  const [points, setPoints] = useState(null)
  const [steps, setSteps] = useState([])
  const [kickList, setKickList] = useState([])

  useEffect(() => {
    console.log(`[LogicLayer]:`, 'useEffect([])')

    const homeTeam = new TeamCls('Шахтер', 'orange')
    const guestTeam = new TeamCls('Заря', 'red')
    const referee = new RefereeCls('Иванов')
    const matchReport = new MatchReportCls(widthCell, heightCell, homeTeam, guestTeam, referee)
    
    const game = new GameCls(matchReport)
    game.start()
    setGame(game)
    if (game?.field?.points) setPoints(game.field.points)

  }, [])

  useEffect(() => {
    console.log('[LogicalLayer]:', 'useEffect([points])')
  }, [points])
  useEffect(() => {
    console.log('[LogicalLayer]:', 'useEffect([steps])')
  }, [steps])

  const clickPoint = ev => {
    const { name } = ev.target.attrs
    const point = game.field.points.filter(p => p.name == name)[0]

    console.log('[name position]:', name)
    game.nextStep(point)
    setPoints(game.field.points)
    setSteps(game.steps)
    setKickList(game.kickList)
  }

  if (!game?.field?.points) return null

  return (
    <>
      <FootballGridLayer 
        width={game.field.points[game.field.points.length-1].x} 
        height={game.field.points[game.field.points.length-1].y} 
        widthCell={10}
        heightCell={10}
        grLineSize={grzLineCount} 
        vrtLineSize={vrtLineCount} 
        />
      <MarkupLayer markup={game.field.markup} />  
      <StepLayer steps={steps} kickList={kickList} />      
      <DotaGridLayer points={game.field.points} clickPoint={clickPoint} />
    </>
  )
}