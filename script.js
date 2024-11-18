// Initialize p5.js sketch
let sketch = (p) => {
    let commands = [];
    let isFilling = false;
    let fillColor = "green";

    p.setup = () => {
        // Create canvas
        let canvas = p.createCanvas(400, 400);
        canvas.parent("output");
        p.angleMode(p.DEGREES);
        p.background(240);
    };

    p.draw = () => {
        // Clear the canvas
        p.background(240);

        // Start filling if applicable
        if (isFilling) {
            p.fill(fillColor);
        } else {
            p.noFill();
        }

        // Reset the drawing position
        p.resetMatrix();
        p.translate(p.width / 2, p.height - 50); // Start from the bottom center

        // Execute each command
        p.beginShape();
        for (let cmd of commands) {
            if (cmd.type === "forward") {
                p.vertex(0, 0);
                p.translate(cmd.value, 0);
            } else if (cmd.type === "left") {
                p.rotate(-cmd.value);
            } else if (cmd.type === "right") {
                p.rotate(cmd.value);
            } else if (cmd.type === "color") {
                fillColor = cmd.value;
            }
        }
        p.endShape(p.CLOSE);
    };

    // Process the Python-like code into commands
    window.runCode = (code) => {
        commands = [];
        isFilling = false;

        let lines = code.split("\n");
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("forward(")) {
                let value = parseInt(line.match(/forward\((\d+)\)/)[1], 10);
                commands.push({ type: "forward", value });
            } else if (line.startsWith("left(")) {
                let value = parseInt(line.match(/left\((\d+)\)/)[1], 10);
                commands.push({ type: "left", value });
            } else if (line.startsWith("right(")) {
                let value = parseInt(line.match(/right\((\d+)\)/)[1], 10);
                commands.push({ type: "right", value });
            } else if (line.startsWith("begin_fill()")) {
                isFilling = true;
            } else if (line.startsWith("end_fill()")) {
                isFilling = false;
            } else if (line.startsWith("color(")) {
                let value = line.match(/color\(["'](.*?)["']\)/)[1];
                commands.push({ type: "color", value });
            }
        }

        p.redraw();
    };
};

// Attach the p5.js sketch
new p5(sketch);

// Attach the "Run Code" functionality to the button
document.getElementById("run-btn").addEventListener("click", () => {
    const
