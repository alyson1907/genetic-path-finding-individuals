class Individual {
  // Constructor: Initializes individual
  constructor (startX = 0, startY = 0, genesSize = 1024) {
    this.locationX = startX
    this.locationY = startY
    this.acceleration = 0 // TODO 
    this.velocity = 4
    this.genes = []
    this.fitness = Number.MAX_SAFE_INTEGER
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

// HTML elements
let canvas

let genesSize = 128 // TODO update to 1024
// Population initial values
const popSize = 1300
let population = []
const startLocationX = 100
const startLocationY = 350
const generationInfo = {
  currentGene: 0,
  currentGeneration: 0
}

// Initial Obstacles (they will be rectangles)
const obstacles = [
  // Borders
  // { iniX: 0, iniY: 0, sizeX: 3, sizeY: 700 }, // left
  // { iniX: 0, iniY: 0, sizeX: 1080, sizeY: 3 }, // top
  // { iniX: 1077, iniY: 0, sizeX: 3, sizeY: 700 }, // right
  // { iniX: 0, iniY: 697, sizeX: 1080, sizeY: 3 }, // bottom
  // Obstacles
  { iniX: 307, iniY: 243, sizeX: 20, sizeY: 122 },
  { iniX: 526, iniY: 547, sizeX: 20, sizeY: 150 },
  { iniX: 533, iniY: 63, sizeX: 30, sizeY: 122 },
  { iniX: 639, iniY: 260, sizeX: 20, sizeY: 150 },
  { iniX: 871, iniY: 565, sizeX: 30, sizeY: 180 },
  { iniX: 896, iniY: 93, sizeX: 20, sizeY: 122 },
]

// Ending/Objective point
const goal = { x: 980, y: 350 }
// Record
let recordX = 0

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
  // Drawing line record
  const { bestX } = circleBestFit(population)
  if (bestX > recordX) recordX = bestX
  line(recordX, 0, recordX, windowHeight)

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
    console.log('Current Generation:', generationInfo.currentGeneration)
    const parents = naturalSelection(population)
    console.log('Number of Selected Parents', parents.length)
    const newPop = generateNewPop(parents, popSize)
    const mutatedPop = mutationToPop(newPop)
    population = mutatedPop
  }
}

// =============================================================================================
// ===================================== POPULATION FUNCTIONS ==================================
// =============================================================================================

const circleBestFit = population => {
  let bestFitness = 9999
  let bestX = 0
  let bestY = 0

  for (let i = 0; i < population.length; i++) {
    if (population[i].fitness <= bestFitness) {
      bestFitness = population[i].fitness
      bestX = population[i].locationX
      bestY = population[i].locationY
    }
  }
  fill(color(255, 120, 120))
  circle(bestX, bestY, 15)
  fill(color(120, 120, 120))
  return {
    bestX,
    bestY
  }
}

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
      if ((random < prob) && !population[i].isDead) selected.push(population[i])
    })

    return selected
  }

  const probs = probabilitiesToBePicked(population)

  const parents = selectParents(population, probs, 0.3)

  return parents
}

const mutationToPop = population => {
  const mutation = (genes, mutationProb = 0.05) => {
    const newGenes = genes.map(gene => {
      const random = Math.random()
      // Applying mutation
      return random < mutationProb ? parseInt(Math.random() * 8) : gene
    })

    return newGenes
  }

  const mutatedPopulation = []
  for (let i = 0; i < population.length; i++) {
    const individual = population[i]
    individual.genes = mutation(population[i].genes)
    mutatedPopulation.push(individual)
  }

  return mutatedPopulation
}

const generateNewPop = (parents, popSize) => {
  /** @returns {Array<Number>} Genes array */
  const crossover = (parent1, parent2) => {
    const median = parseInt(parent1.genes.length / 2)
    const newGenes = []
    // Parent1
    for (let i = 0; i < median; i++) {
      newGenes[i] = parent1.genes[i]
    }
    // Parent2
    for (let i = median; i < parent2.genes.length; i++) {
      newGenes[i] = parent2.genes[i]
    }
    return newGenes
  }

  // Generanting next generation
  // Applying Crossing over and Mutation
  const children = []
  while (parents.length >= 2) {
    const parent1 = parents.pop()
    const parent2 = parents.pop()
    // Generating children
    const childGenes = crossover(parent1, parent2)
    // each parent will generate X children
    for (let i = 0; i < 3; i++) {
      const child = new Individual(startLocationX, startLocationY)
      child.genes = childGenes
      // We should reserve X% of empty slots for new-coming children, so we only add the children if the `children array` is below that limit
      if (children.length <= parseInt(popSize * 0.8)) children.push(child)
    }
  }

  // Completing the remaining generation
  const newPop = [...children]
  for (let i = newPop.length; i < popSize; i++) {
    newPop.push(new Individual(startLocationX, startLocationY, genesSize))
  }

  return newPop
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
