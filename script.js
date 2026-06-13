/**
 * FARMSPHERICA - Interactive 3D WebGL Layer
 * Powered by Three.js
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. BACKGROUND FLOATING MOLECULES MATRIX
    // ==========================================================================
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const bgRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(bgRenderer.domElement);

    const particleCount = 70;
    const particleGeometry = new THREE.IcosahedronGeometry(0.1, 1);
    // Vibrant Green matching the brand theme
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    const particleGroup = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
        const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
        mesh.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        mesh.userData = {
            speedX: (Math.random() - 0.5) * 0.01,
            speedY: (Math.random() - 0.5) * 0.01
        };
        particleGroup.add(mesh);
    }
    bgScene.add(particleGroup);
    bgCamera.position.z = 5;


    // ==========================================================================
    // 2. DEDICATED HERO INTERACTIVE HYDROPONIC MODEL
    // ==========================================================================
    const heroContainer = document.getElementById('farmspherica-3d-model');
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(45, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 100);
    const heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroContainer.appendChild(heroRenderer.domElement);

    // Realistic Stage Lighting Environment
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x10b981, 1.5);
    directionalLight.position.set(5, 10, 7);
    heroScene.add(directionalLight);

    // Constructing the Abstract Hydroponic Asset Group
    const hydroGroup = new THREE.Group();

    // Base Reservoir Ring (Slate Black)
    const ringGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const baseRing = new THREE.Mesh(ringGeo, ringMat);
    baseRing.position.y = -1.2;
    hydroGroup.add(baseRing);

    // Plant Sprout Stem (Deep Emerald Green)
    const stemGeo = new THREE.CylinderGeometry(0.08, 0.15, 2, 16);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.5 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    hydroGroup.add(stem);

    // Floating Geometric Nodes (Representing nutrient-fed optimization)
    const nodeGeo = new THREE.DodecahedronGeometry(0.35, 0);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.1, roughness: 0.1 });

    const node1 = new THREE.Mesh(nodeGeo, nodeMat);
    node1.position.set(0.6, 0.4, 0);
    const node2 = new THREE.Mesh(nodeGeo, nodeMat);
    node2.position.set(-0.6, -0.2, 0);

    hydroGroup.add(node1, node2);
    heroScene.add(hydroGroup);

    heroCamera.position.z = 4.5;


    // ==========================================================================
    // 3. MOUSE & TOUCH INTERACTIVE CAPABILITIES
    // ==========================================================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Desktop Drag Controls
    heroContainer.addEventListener('mousedown', () => { isDragging = true; });

    heroContainer.addEventListener('mousemove', (e) => {
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (isDragging) {
            hydroGroup.rotation.y += deltaMove.x * 0.01;
            hydroGroup.rotation.x += deltaMove.y * 0.01;
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // Mobile / Responsive Touch Controls
    heroContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    heroContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
        };
        hydroGroup.rotation.y += deltaMove.x * 0.01;
        hydroGroup.rotation.x += deltaMove.y * 0.01;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener('touchend', () => { isDragging = false; });


    // ==========================================================================
    // 4. UNIFIED UNIFORM ANIMATION TICK LOOP
    // ==========================================================================
    function animate() {
        requestAnimationFrame(animate);

        // Slow ambient particle drifting
        particleGroup.children.forEach(particle => {
            particle.position.x += particle.userData.speedX;
            particle.position.y += particle.userData.speedY;

            // Simple boundary bounce vector logic
            if (Math.abs(particle.position.x) > 8) particle.userData.speedX *= -1;
            if (Math.abs(particle.position.y) > 6) particle.userData.speedY *= -1;

            particle.rotation.x += 0.005;
            particle.rotation.y += 0.005;
        });
        particleGroup.rotation.y += 0.0007;

        // Auto-rotate Hero element when left untouched by user
        if (!isDragging) {
            hydroGroup.rotation.y += 0.005;
        }

        // Render Frame Updates
        bgRenderer.render(bgScene, bgCamera);
        heroRenderer.render(heroScene, heroCamera);
    }


    // ==========================================================================
    // 5. VIEWPORT RESIZE HANDLING (RESPONSIVENESS GUARANTEE)
    // ==========================================================================
    window.addEventListener('resize', () => {
        // Adjust background full-width setup
        bgCamera.aspect = window.innerWidth / window.innerHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(window.innerWidth, window.innerHeight);

        // Adjust Hero local canvas container frame
        heroCamera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    });

    // Execute the animation pipeline
    animate();
});