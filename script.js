// Farmspherica - Interactive Page Controls & 3D Renderings

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scrolled State
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.card-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Once visible, we can unobserve if we only want it to animate once
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before entering viewport fully
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Growth Simulator Widget Logic
    const growthSlider = document.getElementById('growth-slider');
    const simDayVal = document.getElementById('sim-day-val');
    const simRootVal = document.getElementById('sim-root-val');
    const simWaterVal = document.getElementById('sim-water-val');
    const simStateVal = document.getElementById('sim-state-val');
    
    const simStem = document.getElementById('sim-stem');
    const simRoots = document.getElementById('sim-roots');
    const simLeaf1 = document.getElementById('sim-leaf-1');
    const simLeaf2 = document.getElementById('sim-leaf-2');
    const simLeaf3 = document.getElementById('sim-leaf-3');
    const simLed = document.getElementById('sim-led');
    const simWater = document.getElementById('sim-water');

    if (growthSlider) {
        growthSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            
            // Map values (1 - 100) to Day (1 - 30)
            const day = Math.ceil((val / 100) * 30);
            simDayVal.textContent = `Day ${day} (${getDayStageName(day)})`;
            
            // Map values to Roots growth (5% to 100%)
            const rootPct = Math.round(5 + (val / 100) * 95);
            simRootVal.textContent = `${rootPct}%`;
            
            // Map values to water used (0.1L to 3.5L)
            const waterUsed = (0.1 + (val / 100) * 3.4).toFixed(1);
            simWaterVal.textContent = `${waterUsed} Liters`;

            // System state and styling changes based on day
            let state = '';
            let ledColor = 'rgba(174, 213, 129, 0.8)'; // default green/yellow glow
            let ledShadow = '0 5px 15px rgba(174, 213, 129, 0.8)';
            
            // Adjust visual plant elements
            if (day <= 3) {
                // Germination / Seed
                state = 'Germinating';
                simStem.style.height = '0px';
                simRoots.style.height = '5px';
                simLeaf1.style.opacity = '0';
                simLeaf2.style.opacity = '0';
                simLeaf3.style.opacity = '0';
                
                // Blue/Purple light for seed root trigger
                ledColor = 'rgba(129, 212, 250, 0.6)';
                ledShadow = '0 5px 15px rgba(129, 212, 250, 0.6)';
            } else if (day <= 10) {
                // Sprouting
                state = 'Sprouting';
                const sproutProgress = (day - 3) / 7; // 0 to 1
                simStem.style.height = `${sproutProgress * 25}px`;
                simRoots.style.height = `${10 + sproutProgress * 25}px`;
                
                // Sprout leaves
                simLeaf1.style.opacity = '1';
                simLeaf1.style.width = `${sproutProgress * 10}px`;
                simLeaf1.style.height = `${sproutProgress * 6}px`;
                simLeaf1.style.transform = `rotate(-30deg) scale(${sproutProgress})`;
                
                simLeaf2.style.opacity = '0';
                simLeaf3.style.opacity = '0';
                
                // Pinkish growth spectrum
                ledColor = 'rgba(236, 64, 122, 0.7)';
                ledShadow = '0 5px 15px rgba(236, 64, 122, 0.7)';
            } else if (day <= 20) {
                // Vegetative growth
                state = 'Vegetative Growth';
                const vegProgress = (day - 10) / 10; // 0 to 1
                simStem.style.height = `${25 + vegProgress * 40}px`;
                simRoots.style.height = `${35 + vegProgress * 30}px`;
                
                // Leaves growth
                simLeaf1.style.width = '16px';
                simLeaf1.style.height = '10px';
                simLeaf1.style.transform = 'rotate(-30deg) scale(1)';
                
                simLeaf2.style.opacity = '1';
                simLeaf2.style.width = `${vegProgress * 15}px`;
                simLeaf2.style.height = `${vegProgress * 9}px`;
                simLeaf2.style.transform = `rotate(30deg) scale(${vegProgress})`;
                
                simLeaf3.style.opacity = '0';
                
                // Bright grow light spectrum
                ledColor = 'rgba(186, 104, 200, 0.8)';
                ledShadow = '0 5px 20px rgba(186, 104, 200, 0.8)';
            } else {
                // Mature / Harvest
                state = 'Ready for Harvest!';
                const matureProgress = (day - 20) / 10; // 0 to 1
                simStem.style.height = `${65 + matureProgress * 25}px`;
                simRoots.style.height = `${65 + matureProgress * 25}px`;
                
                simLeaf1.style.width = '18px';
                simLeaf1.style.height = '11px';
                
                simLeaf2.style.width = '16px';
                simLeaf2.style.height = '10px';
                simLeaf2.style.transform = 'rotate(30deg) scale(1)';
                
                simLeaf3.style.opacity = '1';
                simLeaf3.style.width = `${matureProgress * 20}px`;
                simLeaf3.style.height = `${matureProgress * 14}px`;
                simLeaf3.style.transform = `rotate(-45deg) scale(${matureProgress})`;
                
                // Full sunlight simulation
                ledColor = 'rgba(255, 235, 59, 0.7)';
                ledShadow = '0 5px 20px rgba(255, 235, 59, 0.7)';
            }
            
            simStateVal.textContent = state;
            simLed.style.backgroundColor = ledColor;
            simLed.style.boxShadow = ledShadow;
            
            // Dynamic nutrient water drop level (recycled, so it decreases slightly over time)
            const waterLevel = 65 - (val / 100) * 12;
            simWater.style.height = `${waterLevel}px`;
        });
    }

    function getDayStageName(day) {
        if (day <= 3) return 'Seed';
        if (day <= 7) return 'Early Sprout';
        if (day <= 12) return 'Active Sprouting';
        if (day <= 18) return 'Rapid Vegetative';
        if (day <= 25) return 'Budding/Filling';
        return 'Mature Harvest';
    }

    // 5. Newsletter Form Submission Mock
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm && newsletterSuccess) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            newsletterSuccess.style.display = 'block';
            newsletterForm.reset();
            setTimeout(() => {
                newsletterSuccess.style.display = 'none';
            }, 5000);
        });
    }

    // ==========================================
    // THREE.JS IMPLEMENTATIONS
    // ==========================================

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not found, skipping 3D renders.');
        return;
    }

    // ------------------------------------------
    // A. 3D BACKGROUND PARTICLES
    // ------------------------------------------
    const bgCanvas = document.getElementById('bg-canvas');
    let bgRenderer, bgScene, bgCamera, bgParticles;
    const particleCount = 100;
    const particleSpeeds = [];
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    function initBackground3D() {
        bgScene = new THREE.Scene();
        bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        bgCamera.position.z = 200;

        bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create organic particles representing nutrients/water
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const greenColor = new THREE.Color('#AED581');
        const blueColor = new THREE.Color('#81D4FA');
        const mintColor = new THREE.Color('#D0F0C0');

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Random positions in space
            positions[i] = (Math.random() - 0.5) * window.innerWidth * 1.5;
            positions[i + 1] = (Math.random() - 0.5) * window.innerHeight * 1.5;
            positions[i + 2] = (Math.random() - 0.5) * 400 - 200;

            // Random colors (mix of green, blue, and mint)
            const randColor = Math.random();
            let colorToUse = greenColor;
            if (randColor > 0.66) colorToUse = blueColor;
            else if (randColor > 0.33) colorToUse = mintColor;

            colors[i] = colorToUse.r;
            colors[i + 1] = colorToUse.g;
            colors[i + 2] = colorToUse.b;

            // Speeds
            particleSpeeds.push({
                x: (Math.random() - 0.5) * 0.15,
                y: (Math.random() + 0.1) * 0.2, // always drift slightly upwards
                z: (Math.random() - 0.5) * 0.05
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Particle texture / style
        // Create a canvas-based smooth circle texture
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 16;
        pCanvas.height = 16;
        const pCtx = pCanvas.getContext('2d');
        const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 16, 16);
        const pTexture = new THREE.CanvasTexture(pCanvas);

        const material = new THREE.PointsMaterial({
            size: 6,
            map: pTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        bgParticles = new THREE.Points(geometry, material);
        bgScene.add(bgParticles);

        window.addEventListener('mousemove', (e) => {
            // Normalized mouse coordinates (-1 to 1)
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 100;
            targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 100;
        });
    }

    function animateBackground3D() {
        requestAnimationFrame(animateBackground3D);

        // Interpolate mouse positions for smooth movement
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Apply gentle mouse inertia to particle group
        if (bgParticles) {
            bgParticles.rotation.y = mouseX * 0.002;
            bgParticles.rotation.x = -mouseY * 0.002;

            const positions = bgParticles.geometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                
                // Add speed
                positions[idx] += particleSpeeds[i].x;
                positions[idx + 1] += particleSpeeds[i].y;
                positions[idx + 2] += particleSpeeds[i].z;

                // Reset position if particle drifts too high or wide
                if (positions[idx + 1] > window.innerHeight * 0.8) {
                    positions[idx + 1] = -window.innerHeight * 0.8;
                    positions[idx] = (Math.random() - 0.5) * window.innerWidth * 1.5;
                }
                if (Math.abs(positions[idx]) > window.innerWidth * 0.9) {
                    positions[idx] = (Math.random() - 0.5) * window.innerWidth * 1.5;
                }
            }

            bgParticles.geometry.attributes.position.needsUpdate = true;
        }

        bgRenderer.render(bgScene, bgCamera);
    }

    try {
        initBackground3D();
        animateBackground3D();
    } catch(err) {
        console.error('Error starting 3D Background:', err);
    }

    // ------------------------------------------
    // B. HERO SECTION 3D MODEL: FARMSPHERICA DEVICE
    // ------------------------------------------
    const heroContainer = document.getElementById('hero-3d-container');
    let heroRenderer, heroScene, heroCamera, deviceGroup;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0.5;

    function initHero3D() {
        if (!heroContainer) return;

        const width = heroContainer.clientWidth;
        const height = heroContainer.clientHeight;

        heroScene = new THREE.Scene();

        heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        heroCamera.position.set(0, 0.5, 6.5);

        heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        heroRenderer.setSize(width, height);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroContainer.appendChild(heroRenderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        heroScene.add(ambientLight);

        // Grow light from top (LED spectrum - pinkish yellow)
        const ledLight = new THREE.DirectionalLight(0xffe0b2, 1.2);
        ledLight.position.set(0, 5, 0);
        heroScene.add(ledLight);

        // Subtle side keylight (blue water light)
        const sideLight = new THREE.DirectionalLight(0xe1f5fe, 0.8);
        sideLight.position.set(3, 1, 2);
        heroScene.add(sideLight);

        // Core glow point light
        const pointLight = new THREE.PointLight(0xaed581, 1.5, 5);
        pointLight.position.set(0, 0, 0);
        heroScene.add(pointLight);

        // Create Device Group
        deviceGroup = new THREE.Group();
        heroScene.add(deviceGroup);

        // 1. Stand Base (Metal cylinder at bottom)
        const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.25, 32);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x2e7d32, // Forest Green stand base
            roughness: 0.2,
            metalness: 0.8
        });
        const standBase = new THREE.Mesh(baseGeo, baseMat);
        standBase.position.y = -2.1;
        deviceGroup.add(standBase);

        // Stand accent ring (metallic grey)
        const ringGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.05, 32);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xaed581, // Lime green accent ring
            roughness: 0.1,
            metalness: 0.9
        });
        const accentRing = new THREE.Mesh(ringGeo, ringMat);
        accentRing.position.y = -1.95;
        deviceGroup.add(accentRing);

        // 2. The Outer Sphere (Semi-transparent Glass Dome)
        const sphereGeo = new THREE.SphereGeometry(2, 40, 40);
        const sphereMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.28,
            roughness: 0.08,
            metalness: 0.1,
            transmission: 0.85, // physical glass transparency
            ior: 1.45,          // index of refraction
            thickness: 0.5,
            specularIntensity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            side: THREE.DoubleSide
        });
        const glassSphere = new THREE.Mesh(sphereGeo, sphereMat);
        deviceGroup.add(glassSphere);

        // 3. Grid Latitude Ring (Gives 3D structure and high-tech feel)
        const gridRingGeo = new THREE.RingGeometry(1.99, 2.01, 64);
        const gridRingMat = new THREE.MeshBasicMaterial({
            color: 0xaed581, // Lime green grid line
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const latitudeRing = new THREE.Mesh(gridRingGeo, gridRingMat);
        latitudeRing.rotation.x = Math.PI / 2;
        deviceGroup.add(latitudeRing);

        // 4. Nutrient Water at the Bottom of the Sphere
        const waterGeo = new THREE.CylinderGeometry(1.7, 1.2, 0.8, 32);
        const waterMat = new THREE.MeshPhongMaterial({
            color: 0x81d4fa, // Sky/water blue
            transparent: true,
            opacity: 0.55,
            shininess: 90,
            specular: 0xffffff
        });
        const waterReservoir = new THREE.Mesh(waterGeo, waterMat);
        waterReservoir.position.y = -1.5;
        deviceGroup.add(waterReservoir);

        // Water surface ring
        const surfaceGeo = new THREE.RingGeometry(0, 1.7, 32);
        const surfaceMat = new THREE.MeshPhongMaterial({
            color: 0x29b6f6,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const waterSurface = new THREE.Mesh(surfaceGeo, surfaceMat);
        waterSurface.rotation.x = Math.PI / 2;
        waterSurface.position.y = -1.1;
        deviceGroup.add(waterSurface);

        // 5. Net Pot (Growing basket holding the stem)
        const potGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.4, 16);
        const potMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7
        });
        const netPot = new THREE.Mesh(potGeo, potMat);
        netPot.position.y = -1.0;
        deviceGroup.add(netPot);

        // 6. The Plant inside the chamber
        const plantGroup = new THREE.Group();
        plantGroup.position.y = -0.9;
        deviceGroup.add(plantGroup);

        // Plant stem
        const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.2, 8);
        const stemMat = new THREE.MeshStandardMaterial({
            color: 0xaed581, // Lime green stem
            roughness: 0.6
        });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.6; // centered
        plantGroup.add(stem);

        // Leaves (Constructed as flattened sphere meshes)
        const leafMat = new THREE.MeshStandardMaterial({
            color: 0x2e7d32, // Dark forest green leaves
            roughness: 0.4,
            side: THREE.DoubleSide
        });
        
        // Leaf 1
        const leaf1Geo = new THREE.SphereGeometry(0.4, 16, 16);
        const leaf1 = new THREE.Mesh(leaf1Geo, leafMat);
        leaf1.scale.set(1, 0.15, 0.55);
        leaf1.rotation.set(0.3, 0.5, 0.4);
        leaf1.position.set(0.25, 0.7, 0.1);
        plantGroup.add(leaf1);

        // Leaf 2
        const leaf2Geo = new THREE.SphereGeometry(0.35, 16, 16);
        const leaf2 = new THREE.Mesh(leaf2Geo, leafMat);
        leaf2.scale.set(1, 0.12, 0.5);
        leaf2.rotation.set(-0.3, -0.6, -0.4);
        leaf2.position.set(-0.24, 0.9, -0.15);
        plantGroup.add(leaf2);

        // Leaf 3 (Top crown sprout)
        const leaf3Geo = new THREE.SphereGeometry(0.25, 16, 16);
        const leaf3 = new THREE.Mesh(leaf3Geo, leafMat);
        leaf3.scale.set(0.5, 0.1, 0.8);
        leaf3.rotation.set(0.8, 0, 0);
        leaf3.position.set(0, 1.2, 0);
        plantGroup.add(leaf3);

        // 7. Roots branching down into the water
        const rootMat = new THREE.MeshBasicMaterial({
            color: 0xfafafa,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        // We create small lines representing organic roots
        for(let r = 0; r < 6; r++) {
            const rootAngle = (r / 6) * Math.PI * 2;
            const points = [];
            points.push(new THREE.Vector3(0, -1.0, 0)); // Start in pot
            points.push(new THREE.Vector3(
                Math.cos(rootAngle) * 0.15, 
                -1.2, 
                Math.sin(rootAngle) * 0.15
            )); // pot edge
            points.push(new THREE.Vector3(
                Math.cos(rootAngle) * 0.35 + (Math.random() - 0.5) * 0.1, 
                -1.5, 
                Math.sin(rootAngle) * 0.35 + (Math.random() - 0.5) * 0.1
            )); // Mid water
            points.push(new THREE.Vector3(
                Math.cos(rootAngle) * 0.45 + (Math.random() - 0.5) * 0.15, 
                -1.8, 
                Math.sin(rootAngle) * 0.45 + (Math.random() - 0.5) * 0.15
            )); // Deep water

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 10, 0.02, 6, false);
            const rootMesh = new THREE.Mesh(tubeGeo, rootMat);
            deviceGroup.add(rootMesh);
        }

        // Set initial rotation
        deviceGroup.rotation.x = targetRotationX;
        deviceGroup.rotation.y = targetRotationY;

        // Interactive mouse rotation handlers
        heroContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            targetRotationY += deltaMove.x * 0.007;
            targetRotationX += deltaMove.y * 0.007;

            // Clamp vertical rotation to prevent flipping upside down
            targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Mobile touch support
        heroContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };

            targetRotationY += deltaMove.x * 0.009;
            targetRotationX += deltaMove.y * 0.009;

            targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        });
    }

    function animateHero3D() {
        requestAnimationFrame(animateHero3D);

        if (deviceGroup) {
            // Apply mouse-drag rotation with damping
            deviceGroup.rotation.y += (targetRotationY - deviceGroup.rotation.y) * 0.1;
            deviceGroup.rotation.x += (targetRotationX - deviceGroup.rotation.x) * 0.1;

            // Auto-rotate slowly when user is not dragging
            if (!isDragging) {
                targetRotationY += 0.0025;
            }

            // Make the plant breathe/sway slightly (biological animation!)
            const time = Date.now() * 0.0015;
            const plantStem = deviceGroup.children.find(child => child.position.y === -0.9);
            if (plantStem) {
                plantStem.rotation.z = Math.sin(time) * 0.025;
                plantStem.rotation.x = Math.cos(time) * 0.015;
            }
        }

        if (heroRenderer && heroScene && heroCamera) {
            heroRenderer.render(heroScene, heroCamera);
        }
    }

    try {
        initHero3D();
        animateHero3D();
    } catch(err) {
        console.error('Error starting Hero 3D simulation:', err);
    }

    // ------------------------------------------
    // C. DYNAMIC WINDOW RESIZING
    // ------------------------------------------
    window.addEventListener('resize', () => {
        // Resize background particles canvas
        if (bgCamera && bgRenderer) {
            bgCamera.aspect = window.innerWidth / window.innerHeight;
            bgCamera.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Resize hero sphere canvas
        if (heroContainer && heroCamera && heroRenderer) {
            const w = heroContainer.clientWidth;
            const h = heroContainer.clientHeight;
            heroCamera.aspect = w / h;
            heroCamera.updateProjectionMatrix();
            heroRenderer.setSize(w, h);
        }
    });
});
