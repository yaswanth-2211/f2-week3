
let initialPosition = null;

// this arrays will hold the image objects after every mouse up.
const history = [];
let historyIndex = -1;


function onMouseDown(e) {
    if (!(actions.circle || actions.rectangle || actions.eraser || actions.freehand || actions.line || actions.arrow)) {
        return;
    }
    // console.log("inside");
    initialPosition = { x: e.clientX, y: e.clientY }; // Initialize initialPosition
    startIndex = history.length - 1;
    c.strokeStyle = formState.strokestyle;
    c.lineWidth = formState.strokewidth;

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e) {
    const currentPosition = { x: e.clientX, y: e.clientY };
    if (actions.freehand) {
        drawFreeHand(currentPosition);
    }
    else if (actions.eraser) {
        handleErase(currentPosition);
    }
    else if (actions.circle) {
        resetToOriginalImage();
        drawCircle(currentPosition);
    }
    else if (actions.rectangle) {
        resetToOriginalImage();
        drawRectangle(currentPosition);
    }
    else if (actions.line) {
        resetToOriginalImage();
        drawLine(currentPosition);
    }
    else if(actions.arrow){
        resetToOriginalImage();
        arrow(currentPosition);
    }
   
}

function onMouseUp() {
    // cleanup
    history.push(c.getImageData(0, 0, canvas.width, canvas.height));
    historyIndex++;
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
}

canvas.addEventListener("mousedown", onMouseDown);

function resetToOriginalImage() {
    if (startIndex !== -1) {
        // we have some drawings before we start the rectangle drawing.
        c.putImageData(history[startIndex], 0, 0);
    }
    else {
        // if i do not have drawings before we start rectangle drawing.
        c.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function drawFreeHand(currentPosition) {
    c.beginPath();
    c.moveTo(initialPosition.x, initialPosition.y);
    c.lineTo(currentPosition.x, currentPosition.y);
    c.lineCap = "round";
    c.lineJoin = "round";
    c.stroke();
    c.closePath();
    initialPosition = currentPosition;
}

function handleErase(currentPosition) {
    c.clearRect(currentPosition.x, currentPosition.y, 10, 10);
}

function drawCircle(currentPosition) {
    c.beginPath();
    const radius = Math.sqrt(
        (currentPosition.x - initialPosition.x) ** 2 +
        (currentPosition.y - initialPosition.y) ** 2
    );

    c.arc(initialPosition.x, initialPosition.y, radius, 0, 2 * Math.PI, true);
    c.stroke();
}

function drawRectangle(currentPosition) {
    c.beginPath();
    // draw rectangle
    let width = currentPosition.x - initialPosition.x;
    let height = currentPosition.y - initialPosition.y;
    c.strokeRect(initialPosition.x, initialPosition.y, width, height);
}

function drawLine(currentPosition) {
    c.beginPath();
    c.moveTo(initialPosition.x, initialPosition.y);
    c.lineTo(currentPosition.x, currentPosition.y);
    c.stroke();
}

function arrow(currentPosition) {
    c.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Ensure that initialPosition is defined
    if (initialPosition) {
        // Draw a line from initialPosition to currentPosition
        c.beginPath();
        c.moveTo(initialPosition.x, initialPosition.y);
        c.lineTo(currentPosition.x, currentPosition.y);
        c.stroke();

        // Calculate the arrowhead coordinates
        const arrowSize = 10; // Adjust the size of the arrowhead as needed
        const angle = Math.atan2(currentPosition.y - initialPosition.y, currentPosition.x - initialPosition.x);
        const arrowX = currentPosition.x - arrowSize * Math.cos(angle);
        const arrowY = currentPosition.y - arrowSize * Math.sin(angle);

        // Draw the forward edge shape
        c.beginPath();
        c.moveTo(arrowX, arrowY);
        c.lineTo(arrowX + arrowSize * Math.cos(angle - Math.PI / 4), arrowY + arrowSize * Math.sin(angle - Math.PI / 4));
        c.lineTo(arrowX + arrowSize * Math.cos(angle + Math.PI / 4), arrowY + arrowSize * Math.sin(angle + Math.PI / 4));
        c.closePath();
        c.fill();
    }
}