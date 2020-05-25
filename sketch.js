function setup() {
  createCanvas(1080, 700)
  background(50)
}

function draw() {
  if (mouseIsPressed) {
    fill(0)
  } else {
    fill(255)
  }
  ellipse(mouseX, mouseY, 80, 80)
}
