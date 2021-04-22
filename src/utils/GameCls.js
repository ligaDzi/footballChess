import { cloneDeep } from 'lodash'
import ScoreboardCls from './ScoreboardCls'
import FieldCls from './FieldCls'
import BallCls from './BallCls'
import RulesCls from './RulesCls'
import { StepCls, StepList } from './StepCls'
import { halfEnum, modeGameEnum } from './helpers'


export default class GameCls {
  #field = null
  #ball = null
  #scoreboard = null
  #homeTeam = null
  #guestTeam = null
  #teamWithBall = null
  #referee = null
  #stepCount = 0
  #steps = new StepList()
  #kickList = []

  constructor(matchReport) {
    const { widthCell, heightCell, homeTeam, guestTeam, referee} = matchReport

    this.#ball = new BallCls()    
    this.#scoreboard = new ScoreboardCls()

    this.#field = new FieldCls(widthCell, heightCell, this.#ball)
    this.#ball.attach(this.#field)

    const { widthField, heightField } = this.#field
    RulesCls.init(widthField, heightField, widthCell, heightCell)
    
    this.#homeTeam = homeTeam
    this.#homeTeam.ball = this.#ball
    
    this.#guestTeam = guestTeam
    this.#guestTeam.ball = this.#ball
    
    this.#referee = referee
    this.#referee.takeMatchReport(homeTeam.name, guestTeam.name)   
  }

  get ball() { return this.#ball }
  get field() { return this.#field }
  get steps() { return this.#steps.list }
  get kickList() { return this.#kickList }
  get teamWithBall() { return this.#teamWithBall }
  

  goal(team) {
    team === halfEnum.HOME ? this.soreboard.goalHT() : this.soreboard.goalGT()
  }

  showMatchScore() {
    const [goalHT, goalGT] = this.soreboard.showMatchScore()
    console.log(`Home Team ${goalHT}:${goalGT} Guest Team`)
  }

  nextStep(point) {
    const { modeGame, prevModeGame } = this.#referee
    const kickEnum = [modeGameEnum.HOME_KICK, modeGameEnum.GUEST_KICK]

    if (kickEnum.includes(modeGame)) {
      this.__makeKick(point)
    } else {
      this.__makeStep(point)
    }

    this.#teamWithBall.step(point)
    
    const { pointsArroundBall, cornerArroundBall } = this.#field  

    // ДВИЖЕНИЕ С МЯЧОМ
    const possibleMovePoints = this.#referee.getPossibleMovePoints(pointsArroundBall, cornerArroundBall, this.#steps)
    if (possibleMovePoints.length > 0) {
      console.log(`this.#steps`, this.#steps)
      if (this.#stepCount === 3) {
        const isPossible3MoveStep = this.#referee.isPossible3MoveStep(point, possibleMovePoints, this.#field, this.#steps)
        
        if (isPossible3MoveStep) {
          console.log('UPPPPPPPPPPPPPPPPP');
          this.#field.updatePossibleMovePoints(possibleMovePoints)
      
          // ПЕРЕДАТЬ МЯЧ СОПЕРНИКУ ПОСЛЕ УДАРА
          if (kickEnum.includes(modeGame)) {
            this.__transferballOpponent()
          }
          return
        }
      } else {
        this.#field.updatePossibleMovePoints(possibleMovePoints)
      
        // ПЕРЕДАТЬ МЯЧ СОПЕРНИКУ ПОСЛЕ УДАРА
        if (kickEnum.includes(modeGame)) {
          this.__transferballOpponent()
        }
        return        
      }      
    }
    
    // УДАР ПО МЯЧУ
    this.#referee.kickTeam(this.#teamWithBall.name)
    const { kickPointsArroundBall } = this.#field
    const possibleKickpoints = this.#referee.getPossibleKickPoints(kickPointsArroundBall, this.#steps, this.#field)
    if (possibleKickpoints.length > 0) {
      this.#field.updatePossibleMovePoints(possibleKickpoints)
      return
    }
    
    console.log('---Next step---') 
  }
  
  start() {
    const nameTeam = this.#referee.startWhistle().getNameTeamWithBall()
    this.__transferBallToTeam(nameTeam)

    const possiblePoints = this.#referee.putBallCentre(this.#field.points)
    this.#field.updatePossibleMovePoints(possiblePoints)
  }

  stop() {
    const nameTeam = this.#referee.stopWhistle().getNameTeamWithBall()
    this.__transferBallToTeam(nameTeam)
  }

  __transferBallToTeam(nameTeam) {
    if (!nameTeam) this.#teamWithBall = null
    if (nameTeam === this.#homeTeam.name) this.#teamWithBall = this.#homeTeam
    if (nameTeam === this.#guestTeam.name) this.#teamWithBall = this.#guestTeam
  }

  __transferballOpponent() {
    const nameTeam = this.#referee.giveBallOpponent().getNameTeamWithBall()
    this.__transferBallToTeam(nameTeam)
  }

  __makeStep(point) {
    if (!this.#ball.point) return
    if (this.#stepCount === 3) {
      this.__transferballOpponent()
      this.#stepCount = 0
    }
    this.#steps.addList( 
      new StepCls(
        this.#teamWithBall.name, 
        this.#teamWithBall.color, 
        this.#ball.point, 
        point
      )
    )
    this.#stepCount++
  }

  __makeKick(point) {
    this.#kickList.push(
      new StepCls(
        this.#teamWithBall.name,
        this.#teamWithBall.color,
        this.#ball.point,
        point
      )
    )
    this.#stepCount = 0
  }
}