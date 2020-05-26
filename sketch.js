class Individual {
  // Constructor: Initializes individual
  constructor (startX = 0, startY = 0, genesSize = 1024) {
    this.locationX = startX
    this.locationY = startY
    this.acceleration = 0 // TODO 
    this.velocity = 1.5
    this.genes = []
    for (let i = 0; i < genesSize; i++) {
      this.genes.push(this.generateRandomInt(7))
    }
  }
  // Generates an random integer between 0 ~ range (inclusive)
  generateRandomInt (range) {
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
  // Returns de distance from the current location and the ending point
  calculateFitness (finishX, finishY) {
    return Math.sqrt(Math.pow((this.locationX - finishX), 2) + Math.pow((this.locationY - finishY), 2))
  }
}

const genesSize = 64 // TODO update to 1024
// Population initial values
const popSize = 100
const population = []
const startLocationX = 100
const startLocationY = 350
const generationInfo = {
  currentGene: 0,
  currentGeneration: 0
}

// Initial Obstacles (they will be rectangles)
const obstacles = [
  { iniX: 307, iniY: 243, sizeX: 20, sizeY: 100 },
  { iniX: 526, iniY: 547, sizeX: 20, sizeY: 100 },
  { iniX: 533, iniY: 63, sizeX: 20, sizeY: 100 },
  { iniX: 639, iniY: 260, sizeX: 20, sizeY: 100 },
  { iniX: 871, iniY: 565, sizeX: 20, sizeY: 100 },
  { iniX: 896, iniY: 93, sizeX: 20, sizeY: 100 },
]

// Ending/Objective point
const goal = { x: 980, y: 350 }

// =============================================================================================
// ===================================== MAIN PROGRAM ==========================================
// =============================================================================================

function setup () {
  createCanvas(1080, 700)
  background('#eee')
  for (let i = 0; i < popSize; i++) {
    const individual = new Individual(startLocationX, startLocationY, genesSize)
    population.push(individual)
  }
}

function draw () {
  clear()
  // Drawing goal
  fill(color(0, 0, 255))
  circle(goal.x, goal.y, 25)
  // Drawing obstacles
  fill(color(0, 255, 255))
  drawObstacles(obstacles)

  fill(color(120, 120, 120))
  drawPopulation(population)

  nextMoment(population)
  generationInfo.currentGene++
  /* if generationInfo.currentGene = geneSize (1024), we should proceed to next generation:
    - TODO Select the top x% from the ALIVE individuals
    - Prepare next generation:
      - CrossOver
      - Mutation
  */
  if (generationInfo.currentGene > genesSize) {
    generationInfo.currentGene = 0
    generationInfo.currentGeneration += 1
  }
}

// =============================================================================================
// ===================================== POPULATION FUNCTIONS ==================================
// =============================================================================================

// Draws each individual in Canvas
const drawPopulation = population => {
  for (let i = 0; i < population.length; i++) {
    circle(population[i].locationX, population[i].locationY, 10)
  }
}

const nextMoment = population => {
  for (let i = 0; i < population.length; i++) {
    population[i].updateVel()
    population[i].updateLocation(population[i].genes[generationInfo.currentGene])
  }
}

// =============================================================================================
// =============================== OBSTACLES FUNCTIONS =========================================
// =============================================================================================

/** This function is reserved by `p5.js` and is called whenever the mouse button is pressed
 * @return Reads mouse input and adds an obstacle rectangle to the obstacle list
 * 
*/
function mouseClicked (event) {
  obstacles.push({
    iniX: event.x - 128,
    iniY: event.y - 128,
    sizeX: 20,
    sizeY: 100
  })
}

const drawObstacles = obstacleList => {
  obstacleList.forEach(obs => rect(obs.iniX, obs.iniY, obs.sizeX, obs.sizeY))
}
