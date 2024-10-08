// network-animation.js
document.addEventListener('DOMContentLoaded', function () {
    const svg = document.querySelector('svg.background');
    const networks = [
        document.getElementById('network1'),
        document.getElementById('network2'),
        document.getElementById('network3'),
        document.getElementById('phoneNetwork')
    ];

    // Load the phone SVG
    fetch('phone.svg')
        .then(response => response.text())
        .then(svgContent => {
            document.getElementById('phone-svg-container').innerHTML = svgContent;
        })
        .catch(error => console.error('Error loading phone SVG:', error));

    const centerColor = '#34C0EC';
    const orbitColor = '#34C0EC';

    const numNetworksMin = 3;
    const numNetworksMax = 5;
    const numNetworks = Math.floor(Math.random() * (numNetworksMax - numNetworksMin + 1)) + numNetworksMin;

    const nodeRadius = 0.5; // This will be used as a percentage of the viewBox
    const nodeRadiusPhone = 0.5; // This will be used as a percentage of the viewBox
    const networkSize = 60;
    const phoneNetworkSize = 30;
    const nodesInOrbitMin = 10;
    const nodesInOrbitMax = 18;
    const wanderRadius = nodeRadius * 5.8;
    const maxSpeed = 0.008;
    const networkSpeed = 0.003;

    let phoneRect = null;

    // Create reusable node definitions
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    const centerNodeDef = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerNodeDef.setAttribute('id', 'centerNode');
    centerNodeDef.setAttribute('r', `${nodeRadius}%`);
    centerNodeDef.setAttribute('fill', centerColor);
    defs.appendChild(centerNodeDef);

    const orbitNodeDef = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    orbitNodeDef.setAttribute('id', 'orbitNode');
    orbitNodeDef.setAttribute('r', `${nodeRadius}%`);
    orbitNodeDef.setAttribute('fill', orbitColor);
    defs.appendChild(orbitNodeDef);

    function createNetwork(centerX, centerY, networkGroup, size) {
        const nodes = [];
        const links = [];

        const nodesInOrbit = Math.floor(Math.random() * (nodesInOrbitMax - nodesInOrbitMin + 1)) + nodesInOrbitMin;

        // Create center node
        const centerNode = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        centerNode.setAttribute('href', '#centerNode');
        centerNode.setAttribute('x', centerX);
        centerNode.setAttribute('y', centerY);
        nodes.push({
            element: centerNode,
            isCenterNode: true,
            x: centerX,
            y: centerY,
            baseX: centerX,
            baseY: centerY,
            offsetX: 0,
            offsetY: 0,
            speed: Math.random() * maxSpeed * 0.5,
            angle: Math.random() * Math.PI * 2
        });
        networkGroup.appendChild(centerNode);

        // Create orbit nodes
        for (let i = 0; i < nodesInOrbit; i++) {
            const angle = (i / nodesInOrbit) * 2 * Math.PI;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);

            const node = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            node.setAttribute('href', '#orbitNode');
            node.setAttribute('x', x);
            node.setAttribute('y', y);
            nodes.push({
                element: node,
                baseAngle: angle,
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                offsetX: 0,
                offsetY: 0,
                speed: Math.random() * maxSpeed,
                angle: Math.random() * Math.PI * 2
            });
            networkGroup.appendChild(node);

            // Create links
            const linkToCenter = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            linkToCenter.setAttribute('stroke', orbitColor);
            linkToCenter.setAttribute('stroke-width', `${nodeRadius / 2}%`);
            linkToCenter.setAttribute('opacity', '0.3');
            links.push({ element: linkToCenter, source: nodes[0], target: nodes[nodes.length - 1] });
            networkGroup.appendChild(linkToCenter);

            if (i > 0) {
                const linkToNeighbor = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                linkToNeighbor.setAttribute('stroke', orbitColor);
                linkToNeighbor.setAttribute('stroke-width', `${nodeRadius / 2}%`);
                linkToNeighbor.setAttribute('opacity', '0.3');
                links.push({ element: linkToNeighbor, source: nodes[nodes.length - 2], target: nodes[nodes.length - 1] });
                networkGroup.appendChild(linkToNeighbor);
            }
        }

        // Connect the last node to the first orbital node
        const lastLink = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lastLink.setAttribute('stroke', orbitColor);
        lastLink.setAttribute('stroke-width', `${nodeRadius / 2}%`);
        lastLink.setAttribute('opacity', '0.3');
        links.push({ element: lastLink, source: nodes[nodes.length - 1], target: nodes[1] });
        networkGroup.appendChild(lastLink);

        return {
            nodes,
            links,
            velocity: {
                x: (Math.random() - 0.5) * networkSpeed,
                y: (Math.random() - 0.5) * networkSpeed
            }
        };
    }

    const networkData = networks.map((network, index) => {
        if (index < 3) {
            const centerX = Math.random() * svg.viewBox.baseVal.width;
            const centerY = Math.random() * svg.viewBox.baseVal.height;
            return createNetwork(centerX, centerY, network, networkSize);
        } else {
            return createNetwork(50, 50, network, phoneNetworkSize);
        }
    });

    function updatePositions(timestamp) {
        if (!phoneRect) {
            const phoneElement = document.querySelector('.mobile-device-container');
            phoneRect = phoneElement.getBoundingClientRect();
        }

        networkData.forEach(({ nodes, links, velocity }, networkIndex) => {
            const centerNode = nodes[0];

            if (networkIndex < 3) { // Only move background networks
                centerNode.baseX += velocity.x;
                centerNode.baseY += velocity.y;

                const maxX = svg.viewBox.baseVal.width - networkSize;
                const maxY = svg.viewBox.baseVal.height - networkSize;
                if (centerNode.baseX < networkSize || centerNode.baseX > maxX) {
                    velocity.x *= -1;
                }
                if (centerNode.baseY < networkSize || centerNode.baseY > maxY) {
                    velocity.y *= -1;
                }

                // Avoid phone area (simplified for now)
                if (
                    centerNode.baseX > phoneRect.left &&
                    centerNode.baseX < phoneRect.right &&
                    centerNode.baseY > phoneRect.top &&
                    centerNode.baseY < phoneRect.bottom
                ) {
                    velocity.x *= -1;
                    velocity.y *= -1;
                }
            }

            // Update center node
            centerNode.angle += centerNode.speed;
            centerNode.offsetX = Math.cos(centerNode.angle) * wanderRadius;
            centerNode.offsetY = Math.sin(centerNode.angle) * wanderRadius;
            centerNode.x = centerNode.baseX + centerNode.offsetX;
            centerNode.y = centerNode.baseY + centerNode.offsetY;

            centerNode.element.setAttribute('x', centerNode.x);
            centerNode.element.setAttribute('y', centerNode.y);

            // Update orbit nodes
            nodes.slice(1).forEach((node, index) => {
                node.baseAngle += 0.0005;
                const size = networkIndex === 3 ? phoneNetworkSize : networkSize;
                node.baseX = centerNode.x + size * Math.cos(node.baseAngle);
                node.baseY = centerNode.y + size * Math.sin(node.baseAngle);

                node.angle += node.speed;
                node.offsetX = Math.cos(node.angle) * wanderRadius;
                node.offsetY = Math.sin(node.angle) * wanderRadius;

                node.x = node.baseX + node.offsetX;
                node.y = node.baseY + node.offsetY;

                node.element.setAttribute('x', node.x);
                node.element.setAttribute('y', node.y);
            });

            // Update links
            links.forEach(link => {
                link.element.setAttribute('x1', link.source.x);
                link.element.setAttribute('y1', link.source.y);
                link.element.setAttribute('x2', link.target.x);
                link.element.setAttribute('y2', link.target.y);
            });
        });

        requestAnimationFrame(updatePositions);
    }

    requestAnimationFrame(updatePositions);

    // Adjust background SVG height
    function adjustBackgroundHeight() {
        console.log('adjustBackgroundHeight');
        // Uncomment and adjust these lines if needed
        // const container = document.querySelector('.container');
        // const backgroundContainer = document.querySelector('.background-container');
        // backgroundContainer.style.height = `${container.offsetHeight}px`;
        // const phoneElement = document.querySelector('.mobile-device-container');
        // phoneRect = phoneElement.getBoundingClientRect();
    }

    window.addEventListener('load', adjustBackgroundHeight);
    window.addEventListener('resize', adjustBackgroundHeight);
});