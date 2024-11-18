let sketch = (p) => {
    let currentX, currentY; // Current drawing position
    let currentAngle = 0; // Current drawing angle
    let isFilling = false; // Whether to fill shapes
    let fillColor = "green"; // Current fill color
    let commands = []; // Parsed commands

    p.setup = () => {
        let canvas = p.createCanvas(400, 400);
        canvas.parent("output");
        p.angleMode(p.DEGREES);
        p.background(240);

        // Start drawing position: bottom center of the canvas
        currentX = p.width / 2;
        currentY = p.height - 50;
        p.noLoop(); // Draw only on command
    };

    const executeCommands = () => {
        p.clear(); // Clear the canvas
        p.background(240); // Reset background

        // Prepare for filling
        if (isFilling) {
            p.fill(fillColor);
        } else {
            p.noFill();
        }

        // Reset to starting position
        currentX = p.width / 2;
        currentY = p.height - 50;
        currentAngle = 0;

        // Start filling if required
        if (isFilling) {
            p.beginShape();
        }

        // Execute commands
        for (let cmd of commands) {
            if (cmd.type === "forward") {
                let newX = currentX + cmd.value * p.cos(currentAngle);
                let newY = currentY - cmd.value * p.sin(currentAngle);
                p.line(currentX, currentY, newX, newY);
                if (isFilling) {
                    p.vertex(currentX, currentY); // Add vertices for fill
                }
                currentX = newX;
                currentY = newY;
            } else if (cmd.type === "left") {
                currentAngle -= cmd.value; // Rotate counter-clockwise
            } else if (cmd.type === "right") {
                currentAngle += cmd.value; // Rotate clockwise
            } else if (cmd.type === "color") {
                fillColor = cmd.value;
                if (isFilling) {
                    p.fill(fillColor);
                }
            }
        }

        // Finish filling if required
        if (isFilling) {
            p.vertex(currentX, currentY); // Close the fill shape
            p.endShape(p.CLOSE);
        }
    };

    window.runCode = (code) => {
        // Reset initial state
        currentX = p.width / 2;
        currentY = p.height - 50;
        currentAngle = 0;
        isFilling = false;
        fillColor = "green";
        commands = [];

        // Parse the input code
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

        // Draw the parsed commands
        executeCommands();
    };
};

// Attach the sketch to the canvas
new p5(sketch);

// Attach the "Run Code" functionality to the button
document.getElementById("run-btn").addEventListener("click", () => {
    const code = document.getElementById("code").value;
    runCode(code);
});
