// =============================================================================================
// ===================================== MAIN PROGRAM ==========================================
// =============================================================================================

// HTML elements
let canvas
const canvasWidth = 1080
const canvasHeight = 700

// Increasing `geneSize` also results in lifetime increasing
let genesSize = 1024
// Population initial values
const popSize = 400
let population = []
const startLocationX = 100
const startLocationY = 350
const generationInfo = {
  currentGene: 0,
  currentGeneration: 0
}

const startingGeneration = 0

// Initial Obstacles (they will be rectangles)
const obstacles = [
  // Borders
  { iniX: -49, iniY: 0, sizeX: 50, sizeY: canvasHeight }, // left
  { iniX: 0, iniY: -40, sizeX: canvasWidth, sizeY: 41 }, // top
  { iniX: canvasWidth - 3, iniY: 0, sizeX: 40, sizeY: canvasHeight }, // right
  { iniX: 0, iniY: canvasHeight - 1, sizeX: canvasWidth, sizeY: 40 }, // bottom

  // Obstacles
  // { iniX: 307, iniY: 243, sizeX: 20, sizeY: 122 },
  // { iniX: 526, iniY: 547, sizeX: 20, sizeY: 150 },
  // { iniX: 533, iniY: 63, sizeX: 30, sizeY: 122 },
  // { iniX: 639, iniY: 260, sizeX: 20, sizeY: 150 },
  // { iniX: 871, iniY: 565, sizeX: 30, sizeY: 180 },
  // { iniX: 896, iniY: 93, sizeX: 20, sizeY: 122 },

  //  Zig-Zag Path
  { iniX: 200, iniY: 0, sizeX: 20, sizeY: canvasHeight - 250 },
  { iniX: 630, iniY: 300, sizeX: 20, sizeY: canvasHeight },
]

// Ending/Objective point
const goal = { x: 980, y: 350 }
// Average Population Distance to the goal point
let avgFitness = 0

function setup () {
  createCanvas(canvasWidth, canvasHeight)
  background('#eee')
  canvas = document.getElementsByTagName('canvas')[0]

  // Initializing population (creating individuals)
  for (let i = 0; i < popSize; i++) {
    const individual = new Individual(startLocationX, startLocationY, genesSize)
    population.push(individual)
  }
  // Running before showing
  while (generationInfo.currentGeneration < startingGeneration) {
    runIteration(false)
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

  runIteration()
}


// =============================================================================================
// =============================== OBSTACLES FUNCTIONS =========================================
// =============================================================================================

/** This function is reserved by `p5.js` and is called whenever the mouse button is pressed
 * @return Reads mouse input and adds an obstacle rectangle to the obstacle list
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

// =============================================================================================
// ===================================== HELPERS ===============================================
// =============================================================================================

const calculateAvgFitness = (population) => {
  const alive = removeDead(population)
  const fitSum = alive.reduce((acc, individual) => {
    return acc += individual.fitness
  }, 0)

  return fitSum / alive.length
}

const removeDead = population => population.filter(individual => !individual.isDead)

/** Runs the the complete iteration for a single moment in lifetime. The function handles:
 * - Walking
 * - Death of individuals
 * - Generation reset
 * 
 */
const runIteration = (print = true) => {
  checkCollisions(population, obstacles)
  nextMoment(population)
  generationInfo.currentGene++
  /* if generationInfo.currentGene = geneSize (1024), we should proceed to next generation:
    - Select the top x% from the ALIVE individuals
    - Prepare next generation:
      - Apply CrossOver using parents
      - Apply Mutation to the new population
  */
  if (generationInfo.currentGene > genesSize) {
    // Next generation
    generationInfo.currentGene = 0
    generationInfo.currentGeneration += 1

    avgFitness = calculateAvgFitness(population)

    if (print) {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      console.log('Current Generation:', generationInfo.currentGeneration)
      console.log('Average Fitness (Lower = Better):', avgFitness)
      console.log('Remaining Alive:', removeDead(population).length)
    }

    const parents = naturalSelection(population)
    if (print) console.log('Number of Selected Parents', parents.length)

    const newPop = generateNewPop(parents, popSize)
    const mutatedPop = mutationToPop(newPop)
    population = mutatedPop
  }
}

