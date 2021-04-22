export default class MatchReportCls {
  #widthCell = null
  #heightCell = null
  #homeTeam = null
  #guestTeam = null
  #referee = null

  constructor(widthCell, heightCell, homeTeam, guestTeam, referee) {
    this.#widthCell = widthCell
    this.#heightCell = heightCell
    this.#homeTeam = homeTeam
    this.#guestTeam = guestTeam
    this.#referee = referee
  }

  get widthCell() { return this.#widthCell }
  get heightCell() { return this.#heightCell }
  get homeTeam() { return this.#homeTeam }
  get guestTeam() { return this.#guestTeam }
  get referee() { return this.#referee }
}