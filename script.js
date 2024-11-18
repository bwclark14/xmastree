// Initialize the p5.js sketch
let sketch = (p) => {
    let commands = []; // List of drawing commands
    let currentX, currentY; // Current position
    let currentAngle = 0; // Current angle
    let isFilling = false; // Fill state
    let fillColor = "green"; // Current fill color

    p.setup = () => {
        // Create the canvas
        let canvas = p.createCanvas(400, 400);
        canvas.parent("output");
        p.angleMode(p.DEGREES);
        p.background(240);

        // Initial drawing position (center bottom of the canvas)
        currentX = p.width / 2;
        currentY = p.height - 50;
    };

    const executeCommands = () => {
        p.clear(); // Clear the canvas
        p.background(240); // Reset background

        if (isFilling) {
            p.fill(fillColor);
        } else {
            p.noFill();
        }

        p.beginShape();
        p.resetMatrix();
        p.translate(currentX, currentY);

        // Execute commands
        for (let cmd of commands) {
            if (cmd.type === "forward") {
                let newX = currentX + cmd.value * p.cos(currentAngle);
                let newY = currentY - cmd.value * p.sin(currentAngle);
                p.line(currentX, currentY, newX, newY);
                currentX = newX;
                currentY = newY;
            } else if (cmd.type === "left") {
                currentAngle -= cmd.value;
            } else if (cmd.type === "right") {
                currentAngle += cmd.value;
            } else if (cmd.type === "color") {
                fillColor = cmd.value;
                p.fill(fillColor);
            }
        }
        p.endShape(p.CLOSE);
    };

    window.runCode = (code) => {
        // Reset state
        commands = [];
        currentX = p.width / 2;
        currentY = p.height - 50;
        currentAngle = 0;
        isFilling = false;
        fillColor = "green";

        // Parse the code
        const lines = code.split("\n");
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("forward(")) {
                const value = parseInt(line.match(/forward\((\d+)\)/)[1], 10);
                commands.push({ type: "forward", value });
            } else if (line.startsWith("left(")) {
                const value = parseInt(line.match(/left\((\d+)\)/)[1], 10);
                commands.push({ type: "left", value });
            } else if (line.startsWith("right(")) {
                const value = parseInt(line.match(/right\((\d+)\)/)[1], 10);
                commands.push({ type: "right", value });
            } else if (line.startsWith("begin_fill()")) {
                isFilling = true;
            } else if (line.startsWith("end_fill()")) {
                isFilling = false;
            } else if (line.startsWith("color(")) {
                const value = line.match(/color\(["'](.*?)["']\)/)[1];
                commands.push({ type: "color", value });
            }
        }

        // Execute parsed commands
        executeCommands();
    };
};

// Attach the p5.js sketch
new p5(sketch);

// Attach the "Run Code" functionality to the button
document.getElementById("run-btn").addEventListener("click", () => {
    const code = document.getElementById("code").value;
    runCode(code);
});
