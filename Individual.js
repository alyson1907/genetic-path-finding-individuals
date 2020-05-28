class Individual {
  // Constructor: Initializes individual
  constructor (startX = 0, startY = 0, genesSize = 1024) {
    this.locationX = startX
    this.locationY = startY
    this.acceleration = 0 // TODO 
    this.velocity = 3
    this.genes = []
    this.fitness = 999999
    this.isDead = false
    for (let i = 0; i < genesSize; i++) {
      this.genes.push(this.generateRandomInt(7))
    }
  }
  // Generates an random integer between 0 ~ range (inclusive)
  generateRandomInt (range = 7) {
    // Adding 1 so that `range` is INCLUSIVE
    return parseInt(Math.random() * (range + 1))
  }

  updateAccel = () => {
    this.acceleration += 1
  }

  updateVel = () => {
    this.velocity += this.acceleration
  }

  /** Direction is a `gene[i]` value representing the direction the Individual will move to in the next iteration
   * The direction goes as:
   * 0          1          2
   * 3     (curr_pos)      4
   * 5          6          7 
   */
  updateLocation = (direction) => {
    if (!this.isDead) {
      switch (direction) {
        case 0:
          this.locationX -= this.velocity
          this.locationY -= this.velocity
          return
        case 1:
          this.locationY -= this.velocity
          return
        case 2:
          this.locationX += this.velocity
          this.locationY -= this.velocity
          return
        case 3:
          this.locationX -= this.velocity
          return
        case 4:
          this.locationX += this.velocity
          return
        case 5:
          this.locationX -= this.velocity
          this.locationY += this.velocity
          return
        case 6:
          this.locationY += this.velocity
          return
        case 7:
          this.locationX += this.velocity
          this.locationY += this.velocity
          return
        default: return
      }
    }
  }
  // Calculates de euclidian distance between the current location and the ending point
  updateFitness (finishX, finishY) {
    this.fitness = Math.sqrt(Math.pow((this.locationX - finishX), 2) + Math.pow((this.locationY - finishY), 2))
  }

  checkCollision (obtacleList) {
    document.getElement
    const shouldDie = obtacleList.some(obs => {
      const obsWidthStart = obs.iniX
      const obsWidthEnd = obs.iniX + obs.sizeX
      const obsHeightStart = obs.iniY
      const obsHeightEnd = obs.iniY + obs.sizeY

      return (this.locationX >= obsWidthStart && this.locationX <= obsWidthEnd) // Is matching sobe obstacle width
        && (this.locationY >= obsHeightStart && this.locationY <= obsHeightEnd) // Is matching sobe obstacle height
      // && () // is Still inside the canvas
    })
    if (shouldDie) this.isDead = true
  }
}
