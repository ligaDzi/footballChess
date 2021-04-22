import { PointCls } from './PointCls'
import { uid } from './helpers'

export class StepCls {
  #id = null
  #nameTeam = null
  #colorTeam = null
  #degree = null
  #points = []

  constructor(nameTeam, colorTeam, startPoint, endPoint) {
    this.#id = uid()
    this.#nameTeam = nameTeam
    this.#colorTeam = colorTeam

    if (startPoint instanceof PointCls && endPoint instanceof PointCls) {
      this.#degree = `${startPoint.name}-${endPoint.name}` 
      this.#points.push(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
    } else {
      throw new Error('[StepCls: Error]: move()')
    }
  }

  get id() { return this.#id }
  get nameTeam() { return this.#nameTeam }
  get colorTeam() { return this.#colorTeam }
  get degree() { return this.#degree }
  get points() { return this.#points }
}

export class StepList {
  #list = []

  constructor(list = []) {
    this.#list = list
  }

  get list() { return this.#list }
  get count() { return this.#list.length }

  addList(value) {
    this.#list.push(value)
  }
  
  isConnectionPoints(point1, point2) {
    const degree = `${point1.name}-${point2.name}`
    const reverseDegree = `${point2.name}-${point1.name}`
    const isConnection = !!this.list.find(step => [degree, reverseDegree].includes(step.degree))

    return isConnection
  }
  
  countStepThroughPoint(point) {
    let countStep = 0
    this.list.forEach(step => {
      if (step.degree.includes(point.name)) countStep++
    })

    return countStep
  }
}