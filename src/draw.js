class Draw {
    static svg;
    static itemLines;
    static checkLines;

    constructor() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('id', 'connection-svg');
        this.svg.style.position = 'absolute';
        this.svg.style.left = '0';
        this.svg.style.top = '0';
        this.svg.style.width = '100vw';
        this.svg.style.height = '100vh';
        this.svg.style.pointerEvents = 'none';
        this.svg.style.zIndex = '1000';
        document.body.appendChild(this.svg);

        this.itemLines = [];
        this.checkLines = [];
    }

    #drawLine(div1, div2) {
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
        this.svg.appendChild(line);

        return line;
    }

    drawCheckLine(div1, div2) {
        const line = this.#drawLine(div1, div2);
        this.checkLines.push(line);
        return line;
    }

    drawItemLine(div1, div2) {
        const line = this.#drawLine(div1, div2);
        this.itemLines.push(line);
        return line;
    }

    deleteItemLine(lineId) {
        this.svg.removeChild(document.getElementById(lineId));
        const index = this.itemLines.findIndex(l => l.id === lineId);
        if (index !== -1) {
            this.itemLines.splice(index, 1);
        }
    }

    deleteItemLines(lines) {
        for (const line of lines) {
            this.deleteItemLine(line.id);
        }
    }

    clearItemLines() {
        for (const line of this.itemLines) {
            this.deleteItemLine(line.id);
        }
    }

    deleteCheckLine(lineId) {
        this.svg.removeChild(document.getElementById(lineId));
        const index = this.checkLines.findIndex(l => l.id === lineId);
        if (index !== -1) {
            this.checkLines.splice(index, 1);
        }
    }

    deleteCheckLines(lines) {
        for (const line of lines) {
            this.deleteCheckLine(line.id);
        }
    }

    clearCheckLines() {
        for (const line of this.checkLines) {
            this.deleteCheckLine(line.id);
        }
    }
}

const draw = new Draw();
export default draw;
export { draw };