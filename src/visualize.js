export function drawCirclesAndCurve() {
    const width = 400, height = 200;
    const circle1 = { x: 100, y: 100, r: 30 };
    const circle2 = { x: 300, y: 100, r: 30 };

    const svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('circle')
        .attr('cx', circle1.x)
        .attr('cy', circle1.y)
        .attr('r', circle1.r)
        .attr('fill', 'steelblue');

    svg.append('circle')
        .attr('cx', circle2.x)
        .attr('cy', circle2.y)
        .attr('r', circle2.r)
        .attr('fill', 'tomato');

    const controlX = (circle1.x + circle2.x) / 2;
    const controlY = circle1.y - 40;
    svg.append('path')
        .attr('d', `M${circle1.x},${circle1.y} Q${controlX},${controlY} ${circle2.x},${circle2.y}`)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}
