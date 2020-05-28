# Genetic Algorithm
## Objective
This repository implements a visualization of a Genetic Algorithm applied to individuals in order to find a path to the Goal Point.

# How to Run/Execute
## Requirements
Make sure you have properly installed:
- [Git](https://git-scm.com/)
- [Node JS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/get-npm)

## Running
- First, clone this repository into your machine:
```
git clone https://gitlab.com/alyson1907/genetic-path-finding-individuals.git
```

Now, change the directory into the created folder ( `cd <folder_name>` ) and do the following:

- Install de repository dependencies:
```
npm install
```

- Run the local server:
```
npm start
```

The command should start a local server **AND** open it in your default browser. You can also manually access the running server by entering `http://localhost:3000/` in the address bar of your browser.

# Important Files
- **sketch.js**: contains the Main program and some generic help functions
- **Individual.js**: contains the definition of each individual
- **population.js**: contains functions related to the population, such as `generateNewPopulation()` and `naturalSelection()`

# The Genetic Approach
The steps below show how the implementation in this repository approaches the genetic algorithm:
> NOTE: A "Gene" of an individual is a sequence of directions the individual will walk to in each iteration 

- For the first generation, individuals with **random genes** are generated
- The entire population are left to walk for a specific amount of time
  - If an individual hit a wall, it **dies**
- When the time is up, **generates a new population**:
  - By using **Natural Selection**, the best `x%` individuals are selected
  - These individuals (**parents**) are shoved into the next population
  - Besides that, the parents randomly **reproduce** between themselves (applying **Crossover**), generating new individuals to fill the next generation
  - **Mutation** is applied to each individual
- The new generation is left to walk...

# Parameters
All the paremeters used to run the program are located at the top of `sketch.js` file. 

Feel free to play with them and see how your population will react!

The tables below describe what each parameter does:
| **Parameter** | **Description** | **Default Value** |
|:-:|--|--|
| canvasWidth/canvasHeight | The size of the available space for the population | 1080, 700 |
| startingGeneration | Chooses at what generation start the visual representation.   Before drawing, it will compute on background all generations (starting from 0) until this parameter.  The greater **startingGeneration** is set, the longer it will take to show the canvas | 0 |
| genesSize | The greater, the longer is the Lifetime for each generation | 1024 |
| popSize | How many individuals each population will contain | 450 |
| startLocationX/startLocationY | Where the population should spawn in a new generation | 100, 350 |