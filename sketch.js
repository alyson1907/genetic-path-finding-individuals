class Individual {
  // Constructor: Initializes individual
  constructor (startX = 0, startY = 0, genesSize = 1024) {
    this.locationX = startX
    this.locationY = startY
    this.acceleration = 0 // TODO 
    this.velocity = 2
    this.genes = []
    this.fitness = Number.MAX_SAFE_INTEGER
    this.isDead = false
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

// HTML elements
let canvas

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
  { iniX: 307, iniY: 243, sizeX: 20, sizeY: 122 },
  { iniX: 526, iniY: 547, sizeX: 20, sizeY: 150 },
  { iniX: 533, iniY: 63, sizeX: 30, sizeY: 122 },
  { iniX: 639, iniY: 260, sizeX: 20, sizeY: 150 },
  { iniX: 871, iniY: 565, sizeX: 30, sizeY: 180 },
  { iniX: 896, iniY: 93, sizeX: 20, sizeY: 122 },
]

// Ending/Objective point
const goal = { x: 980, y: 350 }

// =============================================================================================
// ===================================== MAIN PROGRAM ==========================================
// =============================================================================================

function setup () {
  createCanvas(1080, 700)
  background('#eee')
  canvas = document.getElementsByTagName('canvas')[0]

  // Initializing population (creating individuals)
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

  checkCollisions(population, obstacles)

  nextMoment(population)
  generationInfo.currentGene++
  /* if generationInfo.currentGene = geneSize (1024), we should proceed to next generation:
    - TODO Select the top x% from the ALIVE individuals
    - Prepare next generation:
      - CrossOver
      - Mutation
  */
  if (generationInfo.currentGene > genesSize) {
    // Next generation
    generationInfo.currentGene = 0
    generationInfo.currentGeneration += 1
    const parents = naturalSelection(population)
    console.log(parents)
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

const checkCollisions = (population, obstacles) => {
  for (let i = 0; i < population.length; i++) {
    const individual = population[i]
    individual.checkCollision(obstacles)
  }
}

/** @returns {Array<Individual>} Array containing individuals for the next generation */
const naturalSelection = (population) => {
  /** @returns {{ min: Number, max: Number }} An object containing the min/max fitness found in the population */
  const getMaxMinFitness = population => {
    let min = 9999
    let max = 0
    for (let i = 0; i < population.length; i++) {
      const individual = population[i]
      if (individual.fitness <= min) min = individual.fitness
      if (individual.fitness >= max) max = individual.fitness
    }
    return { min, max }
  }

  /** @returns {Array<Number>} An array containing the probabilities to be picked for next generation for each individual */
  const probabilitiesToBePicked = population => {
    const { min, max } = getMaxMinFitness(population)
    const probabilities = []

    for (let i = 0; i < population.length; i++) {
      const individual = population[i]
      // Normalizing fitness to range [1.0 ~ 0.0] (Lower fitness = 1.0, Higher fitness = 0.0)
      probabilities[i] = Math.abs(((individual.fitness - min) / (max - min)) - 1)
    }
    return probabilities
  }

  /**
   * @param {Array<Number>} probs Array of float numbers in range [0.0 ~ 1]. Each position represents the probability of the individual `i` to be selected
   * @param {number} [weight=0] Float number between 0.0 ~ 1.0. The greater, the less individuals will be picked
   */
  const selectParents = (population, probs, weight = 0) => {
    const selected = []
    // Selecting individuals
    probs.forEach((prob, i) => {
      const random = Math.random() + weight
      if (random < prob) selected.push(population[i])
    })

    return selected
  }

  const probs = probabilitiesToBePicked(population)
  const parents = selectParents(population, probs, 0.2)
  return parents
}

const nextMoment = population => {
  for (let i = 0; i < population.length; i++) {
    const individual = population[i]
    individual.updateVel()
    individual.updateLocation(population[i].genes[generationInfo.currentGene])
    individual.updateFitness(goal.x, goal.y)
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
    iniX: event.layerX,
    iniY: event.layerY,
    sizeX: 20,
    sizeY: 100
  })
}

const drawObstacles = obstacleList => {
  obstacleList.forEach(obs => rect(obs.iniX, obs.iniY, obs.sizeX, obs.sizeY))
}
