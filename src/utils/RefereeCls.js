import RulesCls from './RulesCls'
import { CentralDistrictCls, GoalPostCls, PointCls, PortalPointCls, StartPointCls } from './PointCls'
import { modeGameEnum, halfEnum, logValue } from './helpers'
import { StepCls, StepList } from './StepCls'
import { NodePossibleMoveCls, PossibleMoveTreeCls } from './PossibleMoveTreeCls'
import { abs } from 'mathjs'

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
   * @returns Array
   */
  getPossibleMovePoints(pointsArroundBall, cornerArroundBall, steps, isBallCentralDistrict = false) {
    let possiblePoints = []
    const cornerABArr = this.__getCornerPointsArr(cornerArroundBall)
    const noCornerPoints = pointsArroundBall.filter(point => !cornerABArr.includes(point))
    
    /**
     * НЕ УГЛОВЫЕ ТОЧКИ
     */
    noCornerPoints.forEach(point => {
      let isPossible = null
      if (isBallCentralDistrict) {
        isPossible = RulesCls.isPointFree(point)
      } else {
        isPossible = RulesCls.isPointGoalPost(point) || (
          RulesCls.isPointFree(point) && 
          RulesCls.isPointNOTCentralDistrict(point)
        )
      }
      if (isPossible) possiblePoints.push(point)
    })

    /**
     * УГЛОВЫЕ ТОЧКИ
     */    
    for (const key in cornerArroundBall) {
      if (Object.hasOwnProperty.call(cornerArroundBall, key)) {

        const corner = cornerArroundBall[key].corner
        const point = cornerArroundBall[key].point

        let isPossible = null
        if (point) {
          if (isBallCentralDistrict) {
            isPossible = RulesCls.isPointFree(point) && RulesCls.isCornerPointNOTBlockCentral(point, corner, pointsArroundBall, steps)
          } else {
            isPossible = (
              RulesCls.isPointGoalPost(point) && 
              RulesCls.isCornerPointNOTBlock(point, corner, pointsArroundBall, steps)
              ) || (
              RulesCls.isPointFree(point) && 
              RulesCls.isPointNOTCentralDistrict(point) && 
              RulesCls.isCornerPointNOTBlock(point, corner, pointsArroundBall, steps)
            )
          }
          if (isPossible) possiblePoints.push(point)       
        }
      }
    }

    return possiblePoints
  } 
  
  /**
   * ВОЗВРАЩАЕТ МАССИВ ТОЧЕК ВОЗМОЖНЫХ ДЛЯ ПЕРЕДАЧИ / УДАРА
   * @param {PointCls} pointBall 
   * @param {Array} kickPoints 
   * @param {StepList} steps 
   * @param {FieldCls} field 
   * @returns Array
   */
  getPossibleKickPoints(pointBall, kickPoints, steps, field) {
    let possiblePoints = []

    kickPoints.forEach(point => {
      // ПОПОДАЕТ ЛИ МЯЧ В ШТАНГУ БЛИЖНИХ ВОРОТ
      const hitGoalPost = field.goalPostsClosestBall.filter(pointGP => {

        // ЕСЛИ МЯЧ ПОПАЛ В ШТАНГУ, ИСКЛЮЧИТЬ ЭТУ ШТАНГУ ИЗ РАСЧЕТОВ
        if (pointBall instanceof GoalPostCls && pointBall === pointGP) return false

        const isHit = RulesCls.isBallHitGoalPost(pointBall, point, pointGP)
        return isHit
      })

      // ЕСЛИ ПОЛЕТ МЯЧА ПЕРЕСЕКАЕТ ДВЕ ШТАНГИ ОСТАВИТЬ ТОЛЬКО БЛИЖНЮЮ ШТАНГУ
      if (hitGoalPost.length > 1) {
        const firstGP = hitGoalPost[0]
        const secondGP = hitGoalPost[1]

        if (abs(pointBall.x - firstGP.x) < abs(pointBall.x - secondGP.x)) {
          possiblePoints.push(firstGP)
        } else {
          possiblePoints.push(secondGP)
        }
        return
      }

      // МЯЧ ПОПАЛ В ОДНУ ШТАНГУ
      if (hitGoalPost.length > 0) {
        possiblePoints.push(hitGoalPost[0])
        return
      }

      const isPossible = RulesCls.isPointGoalPost(point) || 
        RulesCls.isPointFree(point) || 
        RulesCls.isPointSurrounded(point, steps, field, this)
      
      if (isPossible) possiblePoints.push(point)
    })

    return possiblePoints
  }

  /**
   * ВОЗВРАЩАЕТ ОБЪЕКТ PossibleMoveTreeCls С ТОЧКАМИ ВОЗМОЖНЫМИ ДЛЯ ВЫХОДА ИЗ ЦЕНТРАЛЬНОГО КРУГА. 
   * @param {PointCls} pointBall 
   * @param {Array} points 
   * @param {FieldCls} field 
   * @param {StepsList} steps 
   * @returns Object
   */
  getPossibleMovePointsCentral(pointBall, points, field, steps) {
    // 1- STEP
    const pointsLength = points.length
    for (let x=0; pointsLength >= (x+1); x++) {

      let { 
        pointMock, 
        nextSteps, 
        possibleMovePoints } = this.__findePossibleMovePoints(points[x], pointBall, field, steps.list, true, true)

        // 2 - STEP
        const possibleMPLength = possibleMovePoints.length
        if (possibleMPLength === 0) return possibleMovePoints

        for (let y=0; possibleMPLength >= (y+1); y++) {

          let {
            possibleMovePoints: possibleMovePoints2
          } = this.__findePossibleMovePoints(possibleMovePoints[y], pointMock, field, nextSteps.list, true, true)

          // 3 - STEP
          const possibleMPLength2 = possibleMovePoints2.length

          for (let z=0; possibleMPLength2 >= (z+1); z++) {

            if (possibleMovePoints2[z] instanceof CentralDistrictCls) {
              possibleMovePoints2[z] = null
            } else {
              possibleMovePoints2[z] = new NodePossibleMoveCls(possibleMovePoints2[z])
            }
          }

          possibleMovePoints2 = possibleMovePoints2.filter(p => p !== null)

          if (possibleMovePoints2.length === 0) {
            possibleMovePoints[y] = null
          } else {
            possibleMovePoints[y] = new NodePossibleMoveCls(possibleMovePoints[y], possibleMovePoints2)
          }
        }
           
        possibleMovePoints = possibleMovePoints.filter(p => p !== null)

        if (possibleMovePoints.length === 0) {
          points[x] = null
        } else {
          points[x] = new NodePossibleMoveCls(points[x], possibleMovePoints)          
        }
    }

    return new PossibleMoveTreeCls(points.filter(p => p !== null))
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
    // 1 - STEP
    const pointsLength = points.length
    for (let i=0; pointsLength >= (i+1); i++) {

      const { 
        pointMock, 
        nextSteps, 
        possibleMovePoints } = this.__findePossibleMovePoints(points[i], pointBall, field, steps.list, false)

      // 2 - STEP
      const possibleMPLength = possibleMovePoints.length
      if (possibleMPLength > 0) {

        for (let x=0; possibleMPLength >= (x+1); x++) {

          const {
            pointMock: pointMock2,
            nextSteps: nextSteps2,
            possibleMovePoints: possibleMovePoints2
          } = this.__findePossibleMovePoints(possibleMovePoints[x], pointMock, field, nextSteps.list, true)

          // 3 - STEP
          const possibleMPLength2 = possibleMovePoints2.length
          if (possibleMPLength2 > 0) {

            for (let y=0; possibleMPLength2 >= (y+1); y++) {
              
              const {
                possibleMovePoints: possibleMovePoints3
              } = this.__findePossibleMovePoints(possibleMovePoints2[y], pointMock2, field, nextSteps2.list, false)

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

  ricochet() {   
    if (this.#modeGame === modeGameEnum.HOME_BALL) this.modeGame = modeGameEnum.GUEST_RICOCHET
    if (this.#modeGame === modeGameEnum.HOME_KICK) this.modeGame = modeGameEnum.GUEST_RICOCHET
    if (this.#modeGame === modeGameEnum.GUEST_BALL) this.modeGame = modeGameEnum.HOME_RICOCHET
    if (this.#modeGame === modeGameEnum.GUEST_KICK) this.modeGame = modeGameEnum.HOME_RICOCHET
    return this
  }

  moveCentralDistrict() {    
    if (this.#modeGame === modeGameEnum.HOME_KICK) this.modeGame = modeGameEnum.GUEST_CENTR
    if (this.#modeGame === modeGameEnum.GUEST_KICK) this.modeGame = modeGameEnum.HOME_CENTR
    return this
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
  
   /**
  * 
  * @param {PointCls} point 
  * @param {PointCls} prevPoint 
  * @param {FieldCls} field 
  * @param {Array} steps 
  * @param {Boolean} isInsertPrevPoint 
  * @returns Object
  */
  __findePossibleMovePoints(point, prevPoint, field, stepArr, isInsertPrevPoint, isPointCentralDistrict = false) {
    const pointMock = point.clone()
    pointMock.checked = true
    let [arroundPoint, cornerArroundPoint] = field.getCortegePArroundCArroundPoint(pointMock)
    const nextSteps = new StepList(Object.values(stepArr))

    if (isInsertPrevPoint) {
      arroundPoint = arroundPoint.map(point => {
        if (point.name === prevPoint.name) return prevPoint
        return point
      })
      for (const key in cornerArroundPoint) {
        if (Object.hasOwnProperty.call(cornerArroundPoint, key)) {
          if (cornerArroundPoint[key].point?.name === prevPoint.name) {
            cornerArroundPoint[key].point = prevPoint
          }                
        }
      }
    }

    nextSteps.addList(new StepCls('nameTeam', 'colorTeam', prevPoint, pointMock))
    const possibleMovePoints = this.getPossibleMovePoints(arroundPoint, cornerArroundPoint, nextSteps, isPointCentralDistrict)

    return { pointMock, nextSteps, possibleMovePoints }
  }
}