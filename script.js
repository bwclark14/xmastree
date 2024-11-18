// Initialize the p5.js canvas
let sketch = (p) => {
    let commands = [];
    let isFilling = false;

    p.setup = () => {
        let canvas = p.createCanvas(400, 400);
        canvas.parent("output");
        p.background(240);
    };

    p.draw = () => {
        p.noLoop();
        p.background(240);
        p.fill(isFilling ? p.color("green") : p.color(240));
        p.beginShape();
        for (let cmd of commands) {
            if (cmd.type === "forward") {
                p.translate(cmd.value, 0);
                p.vertex(0, 0);
            } else if (cmd.type === "left") {
                p.rotate(p.radians(-cmd.value));
            } else if (cmd.type === "right") {
                p.rotate(p.radians(cmd.value));
            }
        }
        p.endShape(p.CLOSE);
    };

    window.runCode = (code) => {
        commands = [];
        isFilling = false;

        // Simulate Python-like commands
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
            }
        }
        p.redraw();
    };
};

new p5(sketch);

// Attach the "Run Code" functionality to the button
document.getElementById("run-btn").addEventListener("click", () => {
    const code = document.getElementById("code").value;
    runCode(code);
});
