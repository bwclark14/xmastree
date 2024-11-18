// Function to run Python code using Skulpt
function runPythonCode() {
    const code = document.getElementById('code').value;
    const outputFrame = document.getElementById('preview').contentWindow.document;

    outputFrame.open();
    outputFrame.write('<html><body></body></html>');
    outputFrame.close();

    Sk.configure({
        output: function (text) {
            const body = outputFrame.body || outputFrame.getElementsByTagName('body')[0];
            body.innerHTML += text.replace(/\n/g, '<br>');
        },
        read: function (filename) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][filename] === undefined) {
                throw `File not found: '${filename}'`;
            }
            return Sk.builtinFiles['files'][filename];
        },
    });

    Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, code, true))
        .then(() => console.log('Code executed successfully'))
        .catch(err => {
            const body = outputFrame.body || outputFrame.getElementsByTagName('body')[0];
            body.innerHTML += `<span style="color: red;">${err.toString()}</span>`;
        });
}

document.getElementById('run-btn').addEventListener('click', runPythonCode);
