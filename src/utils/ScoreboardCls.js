export default class ScoreboardCls {
  #goalHT = 0
  #goalGT = 0
  #stepCount = 0
  
  constructor() {
  }
  
  get stepCount() { return this.#stepCount}
  
  showMatchScore() {
    return [this.#goalHT, this.#goalGT]
  }

  goalHT() { this.#goalHT += 1 }
  goalGT() { this.#goalGT += 1 }

  moveStep() { this.#stepCount += 1 }
  cancelStep() {
    if (this.#stepCount > 0) this.#stepCount -= 1
  }
}