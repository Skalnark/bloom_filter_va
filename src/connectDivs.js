export function drawLine(div1, div2, svg) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    const startX = rect1.left + rect1.width / 2 + window.scrollX;
    const startY = rect1.top + rect1.height / 2 + window.scrollY;
    const endX = rect2.left + rect2.width / 2 + window.scrollX;
    const endY = rect2.top + rect2.height / 2 + window.scrollY;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('stroke', '#2a4d8f');
    line.setAttribute('stroke-width', '2');
    line.id = div1.id + '-' + div2.id;
    svg.appendChild(line);

    return line;
}

export function deleteLine(lineId, svg, lines) {
    if (svg) {
        const line = document.getElementById(lineId);
        if (line) {
            svg.removeChild(line);
            const index = lines.findIndex(l => l.id === lineId);
            if (index !== -1) {
                lines.splice(index, 1);
            }
        }
    }
}

export function clearAllLines(svg, lines) {
    for (const line of lines) {
        const svgLine = document.getElementById(line.id);
        if (svgLine) {
            svg.removeChild(svgLine);
        }
    }
    lines.length = 0;
}

export function initializeSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'connection-svg');
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = '100vw';
    svg.style.height = '100vh';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1000';

    document.body.appendChild(svg);
    return svg;
}