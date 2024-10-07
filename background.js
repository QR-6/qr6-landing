
                        document.addEventListener('DOMContentLoaded', function () {
            const svg = document.querySelector('svg');
                        const network = document.getElementById('network');


                            
                        const centerColor = '#FFFFFF';
                        const orbitColor = '#34C0EC';

                        const MIN_NODES = 10;
                        const MAX_NODES = 20;
                        const nodesInOrbit = MIN_NODES + Math.floor(Math.random() * (MAX_NODES - MIN_NODES));


                        const SIZE = 10;
                        const nodeRadius = SIZE * .2;
                        const networkSize = SIZE * 4; // Increased for better visibility
                        const wanderRadius = SIZE * 1;


                        const SPEED = .01;
                        const maxSpeed = SPEED * 3;

                        const nodeOpacity = 0.4;
                        const linkOpacity = 0.3;
                        const centerNodeOpacity = 0.8;

                        function createNetwork(centerX, centerY) {
                const nodes = [];
                        const links = [];

                        // Create center node
                        const centerNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        centerNode.setAttribute('r', nodeRadius); // Increased size for visibility
                        centerNode.setAttribute('fill', centerColor);
                        centerNode.setAttribute('opacity', centerNodeOpacity);
                        centerNode.setAttribute('cx', centerX);
                        centerNode.setAttribute('cy', centerY);
                        nodes.push({
                            element: centerNode,
                        isCenterNode: true,
                        x: centerX,
                        y: centerY,
                        baseX: centerX,
                        baseY: centerY,
                        offsetX: 0,
                        offsetY: 0,
                        speed: Math.random() * maxSpeed * 0.2,
                        angle: Math.random() * Math.PI * 2
                });
                        network.appendChild(centerNode);

                        // Create orbit nodes
                        for (let i = 0; i < nodesInOrbit; i++) {
                    const angle = (i / nodesInOrbit) * 2 * Math.PI;
                        const x = centerX + networkSize * Math.cos(angle);
                        const y = centerY + networkSize * Math.sin(angle);

                        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        node.setAttribute('r', nodeRadius);
                        node.setAttribute('fill', orbitColor);
                            node.setAttribute('opacity', nodeOpacity);
                        node.setAttribute('cx', x);
                        node.setAttribute('cy', y);
                        nodes.push({
                            element: node,
                        baseAngle: angle,
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        offsetX: 0,
                        offsetY: 0,
                        speed: maxSpeed + (Math.random() * maxSpeed),
                        angle: Math.random() * Math.PI * 2
                    });
                        network.appendChild(node);

                        // Create link to center node
                        const linkToCenter = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        linkToCenter.setAttribute('stroke', orbitColor);
                        linkToCenter.setAttribute('stroke-width', 0.5);
                        linkToCenter.setAttribute('opacity', linkOpacity);
                        links.push({element: linkToCenter, source: nodes[0], target: nodes[nodes.length - 1] });
                        network.appendChild(linkToCenter);

                    // Create links to neighboring nodes
                    if (i > 0) {
                        const linkToNeighbor = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        linkToNeighbor.setAttribute('stroke', orbitColor);
                        linkToNeighbor.setAttribute('stroke-width', 0.5);
                        linkToNeighbor.setAttribute('opacity', linkOpacity);
                        links.push({element: linkToNeighbor, source: nodes[nodes.length - 2], target: nodes[nodes.length - 1] });
                        network.appendChild(linkToNeighbor);
                    }
                }

                        // Connect the last node to the first orbital node
                        const lastLink = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        lastLink.setAttribute('stroke', orbitColor);
                        lastLink.setAttribute('stroke-width', 0.5);
                        lastLink.setAttribute('opacity', linkOpacity);
                        links.push({element: lastLink, source: nodes[nodes.length - 1], target: nodes[1] });
                        network.appendChild(lastLink);

                        return {nodes, links};
            }

                        const {nodes, links} = createNetwork(100, 100);

                        function updatePositions(timestamp) {
                const centerNode = nodes[0];

                        // Update center node
                        centerNode.angle += centerNode.speed;
                        centerNode.offsetX = Math.cos(centerNode.angle) * wanderRadius;
                        centerNode.offsetY = Math.sin(centerNode.angle) * wanderRadius;
                        centerNode.x = centerNode.baseX + centerNode.offsetX;
                        centerNode.y = centerNode.baseY + centerNode.offsetY;

                        // Keep center node within bounds
                        centerNode.x = Math.max(nodeRadius * 2, Math.min(200 - nodeRadius * 2, centerNode.x));
                        centerNode.y = Math.max(nodeRadius * 2, Math.min(200 - nodeRadius * 2, centerNode.y));

                        centerNode.element.setAttribute('cx', centerNode.x);
                        centerNode.element.setAttribute('cy', centerNode.y);

                // Update orbit nodes
                nodes.slice(1).forEach((node, index) => {
                            // Slowly rotate the base position
                            node.baseAngle += 0.0005;
                        node.baseX = centerNode.x + networkSize * Math.cos(node.baseAngle);
                        node.baseY = centerNode.y + networkSize * Math.sin(node.baseAngle);

                        // Update the wandering offset
                        node.angle += node.speed;
                        node.offsetX = Math.cos(node.angle) * wanderRadius;
                        node.offsetY = Math.sin(node.angle) * wanderRadius;

                        // Set the final position
                        node.x = node.baseX + node.offsetX;
                        node.y = node.baseY + node.offsetY;

                        // Update node position
                        node.element.setAttribute('cx', node.x);
                        node.element.setAttribute('cy', node.y);
                });

                // Update links
                links.forEach(link => {
                            link.element.setAttribute('x1', link.source.x);
                        link.element.setAttribute('y1', link.source.y);
                        link.element.setAttribute('x2', link.target.x);
                        link.element.setAttribute('y2', link.target.y);
                });

                        requestAnimationFrame(updatePositions);
            }

                        requestAnimationFrame(updatePositions);
        });
