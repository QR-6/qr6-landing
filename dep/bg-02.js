
                        document.addEventListener('DOMContentLoaded', function () {
            const svg = document.querySelector('svg');
                        const network = document.getElementById('network');
                        const numNetworks = 5; // Number of networks
                        const networks = [];

                        const color = '#34C0EC'; // Cyan color for all networks
                        const centerNodeRadius = 5;
                        const orbitNodeRadius = 2;
                        const movementRangeFactor = 0.4; // Movement range as a factor of baseOrbitRadius

                        function createNetwork(centerX, centerY, size) {
                const nodes = [];
                        const links = [];
                        const baseOrbitRadius = size / 2;
                        const nodesPerNetwork = Math.floor(size / 10); // Number of nodes scales with size
                        const movementRange = baseOrbitRadius * movementRangeFactor;

                        // Create center node
                        const centerNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        centerNode.setAttribute('r', centerNodeRadius * (size / 200)); // Scale center node size
                        centerNode.setAttribute('fill', color);
                        centerNode.setAttribute('opacity', '0.8');
                        centerNode.setAttribute('cx', centerX);
                        centerNode.setAttribute('cy', centerY);
                        nodes.push({
                            element: centerNode,
                        isCenterNode: true
                });
                        network.appendChild(centerNode);

                        // Create orbit nodes
                        for (let i = 0; i < nodesPerNetwork; i++) {
                    const angle = (i / nodesPerNetwork) * 2 * Math.PI;
                        const x = centerX + baseOrbitRadius * Math.cos(angle);
                        const y = centerY + baseOrbitRadius * Math.sin(angle);

                        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        node.setAttribute('r', orbitNodeRadius * (size / 200)); // Scale orbit node size
                        node.setAttribute('fill', color);
                        node.setAttribute('opacity', '0.5');
                        node.setAttribute('cx', x);
                        node.setAttribute('cy', y);
                        nodes.push({
                            element: node,
                        angle: angle,
                        baseX: x,
                        baseY: y,
                        speedX: (Math.random() - 0.5) * 2,
                        speedY: (Math.random() - 0.5) * 2
                    });
                        network.appendChild(node);

                        // Create link to center node
                        const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        link.setAttribute('stroke', color);
                        link.setAttribute('stroke-width', 0.3 * (size / 200)); // Scale line width
                        link.setAttribute('opacity', '0.3');
                        links.push({
                            element: link,
                        source: nodes[0],
                        target: nodes[nodes.length - 1]
                    });
                        network.appendChild(link);
                }

                        return {nodes, links, centerX, centerY, baseOrbitRadius, movementRange};
            }

                        // Create multiple networks with random positions and sizes
                        for (let i = 0; i < numNetworks; i++) {
                const size = Math.random() * 150 + 100; // Random size between 100 and 250
                        const centerX = Math.random() * (1200 - size) + size / 2;
                        const centerY = Math.random() * (800 - size) + size / 2;
                        networks.push(createNetwork(centerX, centerY, size));
            }

                        function updatePositions() {
                            networks.forEach(({ nodes, links, centerX, centerY, baseOrbitRadius, movementRange }) => {
                                nodes.forEach((node, index) => {
                                    if (!node.isCenterNode) {
                                        // Update position
                                        node.baseX += node.speedX;
                                        node.baseY += node.speedY;

                                        // Calculate distance from center
                                        const dx = node.baseX - centerX;
                                        const dy = node.baseY - centerY;
                                        const distance = Math.sqrt(dx * dx + dy * dy);

                                        // If too far from base orbit, adjust direction
                                        if (Math.abs(distance - baseOrbitRadius) > movementRange) {
                                            const angle = Math.atan2(dy, dx);
                                            node.baseX = centerX + baseOrbitRadius * Math.cos(angle);
                                            node.baseY = centerY + baseOrbitRadius * Math.sin(angle);
                                            // Reverse direction with some randomness
                                            node.speedX = -node.speedX + (Math.random() - 0.5) * 0.5;
                                            node.speedY = -node.speedY + (Math.random() - 0.5) * 0.5;
                                        }

                                        // Apply position
                                        node.element.setAttribute('cx', node.baseX);
                                        node.element.setAttribute('cy', node.baseY);
                                    }
                                });

                                links.forEach(link => {
                                    link.element.setAttribute('x1', link.source.element.getAttribute('cx'));
                                    link.element.setAttribute('y1', link.source.element.getAttribute('cy'));
                                    link.element.setAttribute('x2', link.target.element.getAttribute('cx'));
                                    link.element.setAttribute('y2', link.target.element.getAttribute('cy'));
                                });
                            });

                        requestAnimationFrame(updatePositions);
            }

                        updatePositions();
        });
