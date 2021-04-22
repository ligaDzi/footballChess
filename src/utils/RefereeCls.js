import RulesCls from './RulesCls'
import { PointCls, StartPointCls } from './PointCls'
import { modeGameEnum, halfEnum } from './helpers'
import { StepCls, StepList } from './StepCls'

export default class RefereeCls {
  #name = null
  #nameHT = null
  #nameGT = null

  #prevModeGame = null
  #modeGame = modeGameEnum.HOME_START

  constructor(name) {
    this.#name = name
  }

  get prevModeGame() { return this.#prevModeGame}
  get modeGame() { return this.#modeGame }
  set modeGame(value) { 
    this.#prevModeGame = this.#modeGame
    this.#modeGame = value
  }

  takeMatchReport(nameHT, nameGT) {
    this.#nameHT = nameHT
    this.#nameGT = nameGT
  }
  
  /**
   * ВОЗВРАЩАЕТ МАССИВ ТОЧЕК ВОЗМОЖНЫХ ДЛЯ ДВИЖЕНИЯ
   * @param {Array} pointsArroundBall 
   * @param {Object} cornerArroundBall 
   * @param {StepList} steps 
   * @returns (Array)
   */
  getPossibleMovePoints(pointsArroundBall, cornerArroundBall, steps) {
    let possiblePoints = []
    const cornerABArr = this.__getCornerPointsArr(cornerArroundBall)
    const noCornerPoints = pointsArroundBall.filter(point => !cornerABArr.includes(point))
    
    /**
     * НЕ УГЛОВЫЕ ТОЧКИ
     */
    noCornerPoints.forEach(point => {
      const isPossible = RulesCls.isPointFree(point) && RulesCls.isPointNOTCentralDistrict(point)
      if (isPossible) possiblePoints.push(point)
    })

    /**
     * УГЛОВЫЕ ТОЧКИ
     */    
    for (const key in cornerArroundBall) {
      if (Object.hasOwnProperty.call(cornerArroundBall, key)) {

        const corner = cornerArroundBall[key].corner
        const point = cornerArroundBall[key].point

        if (point) {
          const isPossible = RulesCls.isPointFree(point) && RulesCls.isPointNOTCentralDistrict(point) && RulesCls.isCornerPointNOTBlock(point, corner, pointsArroundBall, steps)
          if (isPossible) possiblePoints.push(point)       
        }
      }
    }

    return possiblePoints
  } 
  
  /**
   * ВОЗВРАЩАЕТ МАССИВ ТОЧЕК ВОЗМОЖНЫХ ДЛЯ ПЕРЕДАЧИ / УДАРА
   * @param {Array} kickPoints 
   * @param {StepList} steps 
   * @param {FieldCls} field 
   * @returns (Array)
   */
  getPossibleKickPoints(kickPoints, steps, field) {
    let possiblePoints = []

    kickPoints.forEach(point => {
      const isPossible = RulesCls.isPointFree(point) || RulesCls.isPointSurrounded(point, steps, field, this)
      if (isPossible) possiblePoints.push(point)
    })

    return possiblePoints
  }

  /**
   * ВОЗМОЖНО ЛИ КОМАНДЕ СДЕЛАТЬ ТРИ ХОДА
   * @param {PointCls} pointBall 
   * @param {Array} points 
   * @param {FieldCls} field 
   * @param {StepList} steps 
   * @returns boolen
   */
  isPossible3MoveStep(pointBall, points, field, steps) {
    let stepsCount = 1
    console.log(`START - stepsCount`, stepsCount)
    
    const pointsLength = points.length
    for (let i=0; pointsLength >= (i+1); i++) {

      let [arroundPoint, cornerArroundPoint] = field.getCortegePArroundCArroundPoint(points[i])
      let nextSteps1 = new StepList(Object.values(steps.list))
      nextSteps1.addList(new StepCls('nameTeam', 'colorTeam', pointBall, points[i]))
      let possibleMovePoints = this.getPossibleMovePoints(arroundPoint, cornerArroundPoint, nextSteps1)

      let possibleMPLength = possibleMovePoints.length
      if (possibleMPLength > 0) {

        for (let x=0; possibleMPLength >= (x+1); x++) {
          let [arroundPoint, cornerArroundPoint] = field.getCortegePArroundCArroundPoint(possibleMovePoints[x])
          let nextSteps2 = new StepList(Object.values(nextSteps1))
          nextSteps2.addList(new StepCls('nameTeam', 'colorTeam', points[i], possibleMovePoints[x]))
          let possibleMovePoints2 = this.getPossibleMovePoints(arroundPoint, cornerArroundPoint, nextSteps2)

          let possibleMPLength2 = possibleMovePoints2.length
          if (possibleMPLength2 > 0) {

            for (let y=0; possibleMPLength2 >= (y+1); y++) {
              let [arroundPoint, cornerArroundPoint] = field.getCortegePArroundCArroundPoint(possibleMovePoints2[y])
              let nextSteps3 = new StepList(Object.values(nextSteps2))
              nextSteps3.addList(new StepCls('nameTeam', 'colorTeam', possibleMovePoints[x], possibleMovePoints2[y]))
              let possibleMovePoints3 = this.getPossibleMovePoints(arroundPoint, cornerArroundPoint, nextSteps3)

              if (possibleMovePoints3.length > 0) return true
            }
          }
        }
      }
    }
    return false
  }

  getNameTeamWithBall() {
    return this.__judgement(this.#modeGame)
  }

  putBallCentre(points) {
    const homeOrGuestBall = this.__homeOrGuestWithBall()
    const centralPoints = points.filter(p => {
      if (p instanceof StartPointCls && RulesCls.isPointFree(p)) {
        if (p.team === halfEnum.HOME_AND_GUEST || p.team === homeOrGuestBall) {
          return true
        }
      }
    })
    return centralPoints
  }

  startWhistle() {
    this.modeGame = modeGameEnum.HOME_START
    return this
  }

  stopWhistle() {
    this.modeGame = modeGameEnum.END_GAME
    return this
  }

  kickTeam(nameTeam) {
    if (nameTeam === this.#nameHT) this.modeGame = modeGameEnum.HOME_KICK
    if (nameTeam === this.#nameGT) this.modeGame = modeGameEnum.GUEST_KICK
  }

  giveBallOpponent() {
    switch (this.#modeGame) {
      case modeGameEnum.HOME_START: 
      case modeGameEnum.HOME_BALL:        
      case modeGameEnum.HOME_KICK:         
      case modeGameEnum.HOME_CENTR:        
      case modeGameEnum.HOME_RICOCHET: {
        this.modeGame = modeGameEnum.GUEST_BALL
        return this
      }   

      case modeGameEnum.GUEST_START:         
      case modeGameEnum.GUEST_BALL:          
      case modeGameEnum.GUEST_KICK:          
      case modeGameEnum.GUEST_CENTR:          
      case modeGameEnum.GUEST_RICOCHET: {
        this.modeGame = modeGameEnum.HOME_BALL
        return this
      } 
    }
  }

  __judgement(modeGame) {    
    switch (modeGame) {
      case modeGameEnum.HOME_START: return this.#nameHT
      case modeGameEnum.HOME_BALL: return this.#nameHT        
      case modeGameEnum.HOME_KICK: return this.#nameHT        
      case modeGameEnum.HOME_CENTR: return this.#nameHT        
      case modeGameEnum.HOME_RICOCHET: return this.#nameHT        
      case modeGameEnum.HOME_GOAL: return this.#nameGT 

      case modeGameEnum.GUEST_START: return this.#nameGT        
      case modeGameEnum.GUEST_BALL: return this.#nameGT        
      case modeGameEnum.GUEST_KICK: return this.#nameGT        
      case modeGameEnum.GUEST_CENTR: return this.#nameGT        
      case modeGameEnum.GUEST_RICOCHET: return this.#nameGT        
      case modeGameEnum.GUEST_GOAL: return this.#nameHT

      case modeGameEnum.END_GAME: return null

      default: return null
    }
  }

  __getCornerPointsArr(cornerPointsObj) {
    let cornerABArr = []

    for (const key in cornerPointsObj) {
      if (Object.hasOwnProperty.call(cornerPointsObj, key)) {
        const point = cornerPointsObj[key].point

        if (point) cornerABArr.push(point)                
      }
    }
    return cornerABArr
  }

  __homeOrGuestWithBall() {
    let homeORGuest = null
    const teamWithBall = this.__judgement(this.#modeGame)
    if (teamWithBall === this.#nameHT) homeORGuest = halfEnum.HOME
    if (teamWithBall === this.#nameGT) homeORGuest = halfEnum.GUEST
    return homeORGuest
  }
}