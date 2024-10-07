document.addEventListener('DOMContentLoaded', function () {
    const svg = document.querySelector('svg');
    const network = document.getElementById('network');
    const numNodes = 18;
    const nodes = [];
    const links = [];

    // 2 colors, cyan and medium grey
    const clr1 = '#00ffff';
    const clr2 = '#808080';

    const speed = 0.5;
    const nodeRadius = 3;


    // Create nodes
    for (let i = 0; i < numNodes; i++) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('r', nodeRadius);
        node.setAttribute('fill', clr1); 
        node.setAttribute('opacity', '0.5');
        node.setAttribute('cx', Math.random() * 1200);
        node.setAttribute('cy', Math.random() * 400);
        nodes.push({
            element: node,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
        network.appendChild(node);
    }

    // Create links
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            if (Math.random() < 0.2) { // Reduced probability for fewer links
                const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                link.setAttribute('stroke', clr1);  // Medium grey
                link.setAttribute('stroke-width', '0.3');
                link.setAttribute('opacity', '0.3');
                links.push({
                    element: link,
                    source: nodes[i],
                    target: nodes[j]
                });
                network.appendChild(link);
            }
        }
    }

    function updatePositions() {
        nodes.forEach(node => {
            let nx = parseFloat(node.element.getAttribute('cx')) + node.vx;
            let ny = parseFloat(node.element.getAttribute('cy')) + node.vy;

            if (nx < 0 || nx > 1200) node.vx *= -1;
            if (ny < 0 || ny > 400) node.vy *= -1;

            node.element.setAttribute('cx', nx);
            node.element.setAttribute('cy', ny);
        });

        links.forEach(link => {
            link.element.setAttribute('x1', link.source.element.getAttribute('cx'));
            link.element.setAttribute('y1', link.source.element.getAttribute('cy'));
            link.element.setAttribute('x2', link.target.element.getAttribute('cx'));
            link.element.setAttribute('y2', link.target.element.getAttribute('cy'));
        });

        requestAnimationFrame(updatePositions);
    }

    updatePositions();
});