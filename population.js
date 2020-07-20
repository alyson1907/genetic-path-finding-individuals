/* eslint-disable */
// =============================================================================================
// ===================================== POPULATION FUNCTIONS ==================================
// =============================================================================================

const circleBestFit = population => {
  let bestFitness = 9999
  let bestX = 0
  let bestY = 0

  for (let i = 0; i < population.length; i++) {
    if ((population[i].fitness <= bestFitness) && !population[i].isDead) {
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

  const selectParentsFlat = (population, percentage = 0.25) => {
    const numberOfParents = popSize * percentage
    // Individual at index 0 will be the one with lower distance to the finish point
    const sortedByFitness = population.sort((indA, indB) => indA.fitness < indB.fitness ? -1 : 1)
    // Removing dead individuals
    const alive = removeDead(sortedByFitness)
    return alive.slice(0, numberOfParents)
  }

  const probs = probabilitiesToBePicked(population)
  const parents = selectParentsFlat(population, selectParentsPercentage)

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
    individual.genes = mutation(population[i].genes, mutationRate)
    mutatedPopulation.push(individual)
  }

  return mutatedPopulation
}

const generateNewPop = (parents, popSize) => {
  /** @returns {Array<Number>} Genes array */
  const crossover = (parent1, parent2) => {
    const median = parseInt((Math.random() * parent1.genes.length))
    const newGenes = {
      child1: [],
      child2: []
    }

    newGenes.child1 = parent1.genes.slice(0, median)
    newGenes.child2 = parent2.genes.slice(0, median)

    newGenes.child1 = [...newGenes.child1, ...parent2.genes.slice(median + 1)]
    newGenes.child2 = [...newGenes.child2, ...parent1.genes.slice(median + 1)]

    return newGenes
  }

  // Generanting next generation
  // Shoving parents for next generation
  const newPop = [...parents.map(parent => {
    // reseting start location for parents
    parent.locationX = startLocationX
    parent.locationY = startLocationY
    return parent
  })]

  // Completing the remaining generation
  for (let i = newPop.length; i < parseInt(newIndPercentage * popSize); i++) {
    newPop.push(new Individual(startLocationX, startLocationY, genesSize))
  }

  // Applying Reproduction (Crossover)
  while (newPop.length <= popSize) {
    // getting 2 random parents to reproduce
    const i = Math.floor(Math.random() * parents.length)
    const i2 = Math.floor(Math.random() * parents.length)
    const parent1 = parents[i]
    const parent2 = parents[i2]

    // Generating children
    const childrenGenes = crossover(parent1, parent2)
    // each parent will generate X children
    const child1 = new Individual(startLocationX, startLocationY)
    const child2 = new Individual(startLocationX, startLocationY)
    child1.genes = childrenGenes.child1
    child2.genes = childrenGenes.child2

    // We should reserve X% of empty slots for new-coming children, so we only add the children if the `children array` is below that limit
    newPop.push(child1)
    newPop.push(child2)
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
