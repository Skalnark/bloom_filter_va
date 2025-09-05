import { Vector } from "./vector.js";

class Draw {
    static svg;
    itemLines;
    checkLines;
    canvasContainer;

    constructor() {
        this.canvasContainer = document.getElementById('filter-container');
        this.initializeSVG();
        this.itemLines = [];
        this.checkLines = [];
    }

    renderLines() {
        this.canvasContainer.removeChild(this.svg);
        this.initializeSVG();

        for (const v of this.itemLines) {
            this.#drawLine(v);
        }

        for (const v of this.checkLines) {
            this.#drawLine(v);
        }
    }

    initializeSVG() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('id', 'connection-svg');
        this.svg.style.position = 'absolute';
        this.svg.style.left = '0';
        this.svg.style.top = '0';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';
        this.svg.style.pointerEvents = 'none';
        this.canvasContainer.appendChild(this.svg);
    }

    #drawLine(v) {
        const dDiv = document.getElementById(v.div2);
        // if the dDiv content is equals to '0' we set the background color to red
        if (dDiv.innerHTML === '0') {
            dDiv.style.backgroundColor = '#f76c6cff';
        }

        if (dDiv.innerHTML === '1') {
            dDiv.style.backgroundColor = '#4bb543ff';
        }
        
        const origin = document.getElementById(v.div1).getBoundingClientRect();
        const destiny = dDiv.getBoundingClientRect();
        const parent = this.canvasContainer.getBoundingClientRect();

        let startX, startY, endX, endY;
        if(v.side === 'right')
        {
            startX = origin.left - parent.left;
            startY = origin.top - parent.top + origin.height / 2;
            endX = destiny.left - parent.left + destiny.width;
            endY = destiny.top - parent.top + destiny.height / 2;
        }

        if(v.side === 'left')
        {
            startX = origin.left + origin.width - parent.left;
            startY = origin.top + origin.height / 2 - parent.top;
            endX = destiny.left - parent.left;
            endY = destiny.top + destiny.height / 2 - parent.top;
        }

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const color = v.color || '#143b83ff';
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '4');
        this.svg.appendChild(line);
        return line;
    }

    drawCheckLine(div1, div2, color) {
        const v = new Vector(div1, div2, 'right', color);
        this.checkLines.push(v);
        return v;
    }

    drawItemLine(div1, div2, color) {
        const v = new Vector(div1, div2, 'left', color);
        this.itemLines.push(v);
        return v;
    }

    clearCheckLines() {
        this.checkLines = [];
    }

    clearAllLines() {
        this.itemLines = [];
        this.checkLines = [];
    }
}

const draw = new Draw();
export default draw;
export { draw };