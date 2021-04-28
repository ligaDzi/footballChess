import { PointCls } from "./PointCls"

export class PossibleMoveTreeCls {
  #nodes = null
  #selectedPathName = null

  constructor(nodesPossibleMove) {
    this.#nodes = nodesPossibleMove
  }

  get length() { return this.#nodes.length }

  firstStep() {
    return this.#nodes.map(item => item.point)
  }
  
  secondStep(pointName) {
    this.#selectedPathName = pointName
    return this.#nodes
      .find(item => item.point.name === pointName)
      .possiblePoints.map(item => item.point)
  }

  thirdSteps(pointName) {
    return this.#nodes
      .find(item => item.point.name === this.#selectedPathName)
      .possiblePoints.find(item => item.point.name === pointName)
      .possiblePoints.map(item => item.point)
  }
}

export class NodePossibleMoveCls {
  #point = null
  #possiblePoints = null

  constructor(point, possiblePoints = null) {
    if (point instanceof PointCls) {
      this.#point = point
    } else {
      throw new Error('[NodePossibleMoveCls]: point NOT PointCls')
    }
    this.#possiblePoints = possiblePoints
  }

  get point() { return this.#point }
  get possiblePoints() { return this.#possiblePoints }
}