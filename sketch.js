class Individual {
  print = () => console.log(1233333)
  generateRandomInt = (range) => {
    // Adding 1 so that `range` is INCLUSIVE
    return parseInt(Math.random() * (range + 1))
  }

  // Constructor
  constructor (genesSize = 512) {
    this.locationX
    this.locationY
    this.acceleration = 1
    this.velocity = 0
    this.genes = []
    
    for (let i = 0; i < genesSize; i++) {
      this.genes.push(this.generateRandomInt(7))
    }
  }

  updateAccel = (force) => {
    this.acceleration += force
  }

  updateVel = () => {
    this.velocity += acceleration
  }

  /** Direction is a `gene[i]` value representing the direction the Individual will move to in the next iteration
   * The direction goes as:
   * 0          1          2
   * 3     (curr_pos)      4
   * 5          6          7  
   */
  updateLocation = (direction) => {
    switch (direction) {
      case 0:
        this.locationX -= 1
        this.locationY -= 1
        return
      case 1:
        this.locationY -= 1
        return
      case 2:
        this.locationX += 1
        this.locationY -= 1
        return
      case 3:
        this.locationX -= 1
        return
      case 4:
        this.locationX += 1
        return
      case 5:
        this.locationX -= 1
        this.locationY += 1
        return
      case 6:
        this.locationY += 1
        return
      case 7:
        this.locationX += 1
        this.locationY += 1
        return
      default: return
    }
  }
}

const popSize = 100
const population = []

function setup () {
  createCanvas(1080, 700)
  background('#eee')
  for ( let i = 0; i < popSize; i++) {
    population.push(new Individual())
  }
}

function draw () {

}



