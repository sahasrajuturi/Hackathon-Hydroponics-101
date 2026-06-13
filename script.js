// Farmspherica - Advanced Interactive Controls & 3D Renderings

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. NAVIGATION SCROLLED STATE
    // ==========================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
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

    // ==========================================
    // 3. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.card-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 4. GROWTH SIMULATOR DASHBOARD
    // ==========================================
    const growthSlider = document.getElementById('growth-slider');
    const simDayVal = document.getElementById('sim-day-val');
    const simRootVal = document.getElementById('sim-root-val');
    const simPhVal = document.getElementById('sim-ph-val');
    const simEcVal = document.getElementById('sim-ec-val');
    const simWaterPct = document.getElementById('sim-water-pct');
    const simAdviceText = document.getElementById('sim-advice-text');
    
    const simStem = document.getElementById('sim-stem');
    const simRoots = document.getElementById('sim-roots');
    const simLeaf1 = document.getElementById('sim-leaf-1');
    const simLeaf2 = document.getElementById('sim-leaf-2');
    const simLeaf3 = document.getElementById('sim-leaf-3');
    const simLed = document.getElementById('sim-led');
    const simWater = document.getElementById('sim-water');

    // Simulator Interactive Buttons
    const btnSimRefill = document.getElementById('btn-sim-refill');
    const btnSimDose = document.getElementById('btn-sim-dose');
    const btnSimPump = document.getElementById('btn-sim-pump');

    let currentSimPh = 5.8;
    let currentSimEc = 1.2;
    let currentWaterPercent = 100;
    let isPumpOn = true;

    // Simulation log advice dictionary
    const adviceLogs = {
        germination: "Keep humidity domes secure. Seed is absorbing initial moisture; LED set to low blue spectrum to initiate primary root anchoring.",
        sprouting: "Seed has sprouted! Thin out excess seedlings. Primary roots are pushing down into the net pot. LED grow lights adjusted to pink growth spectrum.",
        vegetative: "Vegetative phase active. Roots have entered the liquid nutrient solution. Keep pH stable between 5.6 and 6.0 to maximize absorption.",
        flowering: "Rapid canopy expansion. Check water levels daily—evapotranspiration is high. Dose nutrients (EC 1.8) to support broad leaf development.",
        harvest: "Harvest window is open! Control temperatures to prevent bitter leaves. Snip mature outer foliage or harvest the whole head."
    };

    if (growthSlider) {
        growthSlider.addEventListener('input', (e) => {
            updateSimulatorState(parseInt(e.target.value));
        });
    }

    function updateSimulatorState(val) {
        const day = Math.ceil((val / 100) * 30);
        simDayVal.textContent = `Day ${day} (${getDayStageName(day)})`;
        
        const rootPct = Math.round(5 + (val / 100) * 95);
        simRootVal.textContent = `${rootPct}%`;
        
        // Base water consumption over 30 days
        currentWaterPercent = Math.round(100 - (val / 100) * 45);
        simWaterPct.textContent = `${currentWaterPercent}%`;
        
        // Dynamic water height in container
        const waterHeight = 65 - (val / 100) * 18;
        simWater.style.height = `${waterHeight}px`;

        // Calculate dynamic pH / EC based on growth stage if not manually altered
        let stage = '';
        let ledColor = 'rgba(174, 213, 129, 0.8)';
        let ledShadow = '0 5px 15px rgba(174, 213, 129, 0.8)';

        if (day <= 3) {
            stage = 'germination';
            simStem.style.height = '0px';
            simRoots.style.height = '5px';
            simLeaf1.style.opacity = '0';
            simLeaf2.style.opacity = '0';
            simLeaf3.style.opacity = '0';
            
            ledColor = 'rgba(129, 212, 250, 0.6)'; // Blue spectrum
            ledShadow = '0 5px 15px rgba(129, 212, 250, 0.6)';
            
            currentSimPh = 5.8;
            currentSimEc = 1.2;
        } else if (day <= 10) {
            stage = 'sprouting';
            const sproutProgress = (day - 3) / 7;
            simStem.style.height = `${sproutProgress * 25}px`;
            simRoots.style.height = `${10 + sproutProgress * 25}px`;
            
            simLeaf1.style.opacity = '1';
            simLeaf1.style.width = `${sproutProgress * 10}px`;
            simLeaf1.style.height = `${sproutProgress * 6}px`;
            simLeaf1.style.transform = `rotate(-30deg) scale(${sproutProgress})`;
            
            simLeaf2.style.opacity = '0';
            simLeaf3.style.opacity = '0';
            
            ledColor = 'rgba(236, 64, 122, 0.7)'; // Pinkish growth
            ledShadow = '0 5px 15px rgba(236, 64, 122, 0.7)';
            
            currentSimPh = 5.7;
            currentSimEc = 1.4;
        } else if (day <= 20) {
            stage = 'vegetative';
            const vegProgress = (day - 10) / 10;
            simStem.style.height = `${25 + vegProgress * 40}px`;
            simRoots.style.height = `${35 + vegProgress * 30}px`;
            
            simLeaf1.style.width = '16px';
            simLeaf1.style.height = '10px';
            simLeaf1.style.transform = 'rotate(-30deg) scale(1)';
            
            simLeaf2.style.opacity = '1';
            simLeaf2.style.width = `${vegProgress * 15}px`;
            simLeaf2.style.height = `${vegProgress * 9}px`;
            simLeaf2.style.transform = `rotate(30deg) scale(${vegProgress})`;
            
            simLeaf3.style.opacity = '0';
            
            ledColor = 'rgba(186, 104, 200, 0.8)'; // Purple spectrum
            ledShadow = '0 5px 20px rgba(186, 104, 200, 0.8)';
            
            currentSimPh = 5.9;
            currentSimEc = 1.8;
        } else {
            stage = 'flowering'; // final mature stage
            const matureProgress = (day - 20) / 10;
            simStem.style.height = `${65 + matureProgress * 20}px`;
            simRoots.style.height = `${65 + matureProgress * 20}px`;
            
            simLeaf1.style.width = '18px';
            simLeaf1.style.height = '11px';
            simLeaf2.style.width = '16px';
            simLeaf2.style.height = '10px';
            simLeaf2.style.transform = 'rotate(30deg) scale(1)';
            
            simLeaf3.style.opacity = '1';
            simLeaf3.style.width = `${matureProgress * 20}px`;
            simLeaf3.style.height = `${matureProgress * 14}px`;
            simLeaf3.style.transform = `rotate(-45deg) scale(${matureProgress})`;
            
            ledColor = 'rgba(255, 235, 59, 0.7)'; // Full sunlight spectrum
            ledShadow = '0 5px 20px rgba(255, 235, 59, 0.7)';
            
            currentSimPh = 6.0;
            currentSimEc = 2.0;

            if (day === 30) stage = 'harvest';
        }

        simPhVal.textContent = `${currentSimPh.toFixed(1)} (${getPhStateLabel(currentSimPh)})`;
        simEcVal.textContent = `${currentSimEc.toFixed(1)} mS/cm`;
        simAdviceText.textContent = adviceLogs[stage];

        if (isPumpOn) {
            simLed.style.backgroundColor = ledColor;
            simLed.style.boxShadow = ledShadow;
        } else {
            simLed.style.backgroundColor = 'rgba(255,255,255,0.1)';
            simLed.style.boxShadow = 'none';
        }
    }

    function getPhStateLabel(ph) {
        if (ph >= 5.5 && ph <= 6.5) return 'Ideal';
        if (ph < 5.5) return 'Too Acidic';
        return 'Too Alkaline';
    }

    // Refill Water Action Button
    if (btnSimRefill) {
        btnSimRefill.addEventListener('click', () => {
            currentWaterPercent = 100;
            simWaterPct.textContent = '100%';
            
            // Refill animation wave
            simWater.style.transition = 'height 1s cubic-bezier(0.16, 1, 0.3, 1)';
            simWater.style.height = '65px';
            
            // Stabilize pH
            currentSimPh = 5.8;
            simPhVal.textContent = '5.8 (Ideal)';
            
            // Temporarily dilute EC slightly
            currentSimEc = Math.max(1.0, currentSimEc - 0.2);
            simEcVal.textContent = `${currentSimEc.toFixed(1)} mS/cm`;

            // Display log update
            simAdviceText.textContent = "⚙️ Tank refilled with fresh pure water. Nutrient concentration diluted slightly, and pH stabilized back to 5.8.";
            
            setTimeout(() => {
                simWater.style.transition = 'none';
            }, 1000);
        });
    }

    // Dose Nutrients Action Button
    if (btnSimDose) {
        btnSimDose.addEventListener('click', () => {
            currentSimEc = Math.min(2.5, currentSimEc + 0.3);
            simEcVal.textContent = `${currentSimEc.toFixed(1)} mS/cm`;
            
            // Nutrients drop pH slightly
            currentSimPh = Math.max(5.2, currentSimPh - 0.15);
            simPhVal.textContent = `${currentSimPh.toFixed(1)} (${getPhStateLabel(currentSimPh)})`;

            // Trigger bubbles speedup animation
            const bubbles = document.querySelectorAll('.bubble');
            bubbles.forEach(b => {
                b.style.animationDuration = '1.2s';
            });

            simAdviceText.textContent = `⚙️ Nutrients dosed. Electrical Conductivity (EC) increased to ${currentSimEc.toFixed(1)} mS/cm. pH level registered at ${currentSimPh.toFixed(1)}.`;

            setTimeout(() => {
                bubbles.forEach(b => {
                    b.style.animationDuration = '3s';
                });
            }, 3000);
        });
    }

    // Toggle Pump Action Button
    if (btnSimPump) {
        btnSimPump.addEventListener('click', () => {
            isPumpOn = !isPumpOn;
            const bubbles = document.querySelectorAll('.bubble');
            
            if (isPumpOn) {
                btnSimPump.classList.add('active');
                btnSimPump.textContent = '🫧 Toggle Pump (ACTIVE)';
                bubbles.forEach(b => b.style.display = 'block');
                updateSimulatorState(growthSlider ? parseInt(growthSlider.value) : 1);
            } else {
                btnSimPump.classList.remove('active');
                btnSimPump.textContent = '💤 Toggle Pump (OFF)';
                bubbles.forEach(b => b.style.display = 'none');
                
                // LED light turns off if pump/circulation stops
                simLed.style.backgroundColor = 'rgba(255,255,255,0.1)';
                simLed.style.boxShadow = 'none';
                simAdviceText.textContent = "⚠️ Water pump turned off. Root aeration halted and grow LED deactivated. Turn pump on to resume photosynthesis.";
            }
        });
    }

    // Initialize Simulator State
    updateSimulatorState(1);

    // ==========================================
    // 5. INTERACTIVE CROP PICKER & 3D MORPHING
    // ==========================================
    const cropButtons = document.querySelectorAll('.crop-btn');
    const cropName = document.getElementById('crop-name');
    const cropDiff = document.getElementById('crop-diff');
    const cropDesc = document.getElementById('crop-desc');
    const cropCycle = document.getElementById('crop-cycle');
    const cropPh = document.getElementById('crop-ph');
    const cropEc = document.getElementById('crop-ec');
    const cropYield = document.getElementById('crop-yield');

    // Crop profiles data
    const cropProfiles = {
        lettuce: {
            name: "Butterhead Lettuce",
            difficulty: "Easy",
            desc: "Crisp, sweet, and tender. Grows into dense, heavy rosettes that are perfect for fresh salads. Exceptionally high success rate for absolute beginners.",
            cycle: "28 Days",
            ph: "5.6 - 6.0",
            ec: "1.2 - 1.8",
            yield: "~150g"
        },
        basil: {
            name: "Sweet Genovese Basil",
            difficulty: "Easy",
            desc: "Extremely aromatic herb with large, shiny green leaves. Perfect for home-made pesto, caprese salads, and garnishing. Enjoys warmer environments.",
            cycle: "35 Days",
            ph: "5.8 - 6.2",
            ec: "1.4 - 2.2",
            yield: "~80g"
        },
        mint: {
            name: "Peppermint",
            difficulty: "Medium",
            desc: "Spreads rapidly and produces lush, cooling green leaves. Fantastic for herbal teas, cocktail garnishes, or salads. Requires periodic trimming to control volume.",
            cycle: "30 Days",
            ph: "6.0 - 6.5",
            ec: "1.4 - 2.0",
            yield: "~100g"
        },
        strawberry: {
            name: "Fresh Strawberries",
            difficulty: "Hard",
            desc: "Produces sweet, red berries right in your dome. Requires pollination assist (gently shaking the plant or using a soft brush) when flowers sprout.",
            cycle: "50 Days",
            ph: "5.5 - 6.0",
            ec: "1.8 - 2.4",
            yield: "~200g"
        }
    };

    let selectedCropType = "lettuce";

    cropButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active state
            cropButtons.forEach(b => b.classList.remove('active'));
            
            // Get selected button
            const selectedBtn = e.currentTarget;
            selectedBtn.classList.add('active');
            
            const cropType = selectedBtn.getAttribute('data-crop');
            selectedCropType = cropType;

            // Update details card info
            const profile = cropProfiles[cropType];
            if (profile) {
                cropName.textContent = profile.name;
                cropDiff.textContent = profile.difficulty;
                cropDesc.textContent = profile.desc;
                cropCycle.textContent = profile.cycle;
                cropPh.textContent = profile.ph;
                cropEc.textContent = profile.ec;
                cropYield.textContent = profile.yield;
                
                // Style difficulty badge color
                if (profile.difficulty === "Easy") {
                    cropDiff.style.backgroundColor = "var(--primary)";
                } else if (profile.difficulty === "Medium") {
                    cropDiff.style.backgroundColor = "#FBC02D";
                } else {
                    cropDiff.style.backgroundColor = "#E53935";
                }
            }

            // Morph/Update the 3D model in the Hero section!
            updateHero3DPlantGeometry(cropType);
        });
    });

    // ==========================================
    // 6. ECO-SAVINGS GROCERY CALCULATOR
    // ==========================================
    const calcLettuce = document.getElementById('calc-lettuce');
    const calcHerbs = document.getElementById('calc-herbs');
    
    const lettuceQtyLabel = document.getElementById('lettuce-qty-label');
    const herbsQtyLabel = document.getElementById('herbs-qty-label');

    const calcWaterSaved = document.getElementById('calc-water-saved');
    const calcMoneySaved = document.getElementById('calc-money-saved');
    const calcCo2Saved = document.getElementById('calc-co2-saved');

    const waterBar = document.getElementById('water-bar');
    const moneyBar = document.getElementById('money-bar');
    const co2Bar = document.getElementById('co2-bar');

    function updateSavingsCalculator() {
        if (!calcLettuce || !calcHerbs) return;

        const lettuceVal = parseInt(calcLettuce.value);
        const herbsVal = parseInt(calcHerbs.value);

        // Update labels
        lettuceQtyLabel.textContent = `${lettuceVal} head${lettuceVal !== 1 ? 's' : ''}`;
        herbsQtyLabel.textContent = `${herbsVal} packet${herbsVal !== 1 ? 's' : ''}`;

        // Calculations (Annual)
        // 1. Water Conserved: Soil farming uses ~250L per lettuce head, 150L per herb pack. Hydro uses 95% less.
        const waterSavedLitres = Math.round((lettuceVal * 237.5 + herbsVal * 142.5) * 52);
        
        // 2. Money saved: Lettuce ~₹150, Herbs ~₹100
        const moneySavedRs = (lettuceVal * 150 + herbsVal * 100) * 52;
        
        // 3. Carbon emissions offset (transport packaging): ~0.4kg per lettuce, 0.25kg per herb pack
        const co2SavedKg = ((lettuceVal * 0.4 + herbsVal * 0.25) * 52).toFixed(1);

        // Animate counter values
        animateCounterValue(calcWaterSaved, waterSavedLitres, ' L');
        animateCounterValue(calcMoneySaved, moneySavedRs, '₹');
        animateCounterValue(calcCo2Saved, parseFloat(co2SavedKg), ' kg');

        // Update progress bars widths
        const maxWater = (10 * 237.5 + 8 * 142.5) * 52;
        const maxMoney = (10 * 150 + 8 * 100) * 52;
        const maxCo2 = (10 * 0.4 + 8 * 0.25) * 52;

        waterBar.style.width = `${Math.min(100, Math.max(5, (waterSavedLitres / maxWater) * 100))}%`;
        moneyBar.style.width = `${Math.min(100, Math.max(5, (moneySavedRs / maxMoney) * 100))}%`;
        co2Bar.style.width = `${Math.min(100, Math.max(5, (parseFloat(co2SavedKg) / maxCo2) * 100))}%`;
    }

    function animateCounterValue(element, target, prefixOrSuffix = '') {
        const currentText = element.textContent.replace(/[^\d.]/g, '');
        const startValue = currentText ? parseFloat(currentText) : 0;
        const duration = 800; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function out-quad
            const easeProgress = progress * (2 - progress);
            
            const currentValue = startValue + (target - startValue) * easeProgress;
            
            if (prefixOrSuffix === '₹') {
                element.textContent = `₹${Math.round(currentValue).toLocaleString('en-IN')}`;
            } else if (prefixOrSuffix === ' L') {
                element.textContent = `${Math.round(currentValue).toLocaleString()}${prefixOrSuffix}`;
            } else {
                element.textContent = `${currentValue.toFixed(1)}${prefixOrSuffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    if (calcLettuce && calcHerbs) {
        calcLettuce.addEventListener('input', updateSavingsCalculator);
        calcHerbs.addEventListener('input', updateSavingsCalculator);
        // Initial run
        updateSavingsCalculator();
    }

    // ==========================================
    // THREE.JS IMPLEMENTATIONS (ADVANCED)
    // ==========================================

    if (typeof THREE === 'undefined') {
        console.warn('Three.js not found, skipping 3D renders.');
        return;
    }

    // ------------------------------------------
    // A. 3D BACKGROUND PARTICLES (GRAVITY MAGNET)
    // ------------------------------------------
    const bgCanvas = document.getElementById('bg-canvas');
    let bgRenderer, bgScene, bgCamera, bgParticles;
    const bgParticleCount = 120;
    const bgParticleSpeeds = [];
    const bgParticleBasePositions = []; // Store home coords
    let bgMouseX = 0, bgMouseY = 0;
    let bgTargetMouseX = 0, bgTargetMouseY = 0;
    let isAttractingParticles = false;

    function initBackground3D() {
        bgScene = new THREE.Scene();
        bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        bgCamera.position.z = 200;

        bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(bgParticleCount * 3);
        const colors = new Float32Array(bgParticleCount * 3);

        const greenColor = new THREE.Color('#2E7D32');
        const limeColor = new THREE.Color('#AED581');
        const blueColor = new THREE.Color('#81D4FA');

        for (let i = 0; i < bgParticleCount * 3; i += 3) {
            const px = (Math.random() - 0.5) * window.innerWidth * 1.5;
            const py = (Math.random() - 0.5) * window.innerHeight * 1.5;
            const pz = (Math.random() - 0.5) * 400 - 100;

            positions[i] = px;
            positions[i + 1] = py;
            positions[i + 2] = pz;

            // Keep base coordinate
            bgParticleBasePositions.push({ x: px, y: py, z: pz });

            const randColor = Math.random();
            let colorToUse = limeColor;
            if (randColor > 0.7) colorToUse = blueColor;
            else if (randColor < 0.3) colorToUse = greenColor;

            colors[i] = colorToUse.r;
            colors[i + 1] = colorToUse.g;
            colors[i + 2] = colorToUse.b;

            bgParticleSpeeds.push({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() + 0.1) * 0.3, // upward drift
                z: (Math.random() - 0.5) * 0.1,
                vx: 0, // dynamic velocity vectors for gravity physics
                vy: 0,
                vz: 0
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Round glowing canvas texture
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
            size: 8,
            map: pTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        bgParticles = new THREE.Points(geometry, material);
        bgScene.add(bgParticles);

        window.addEventListener('mousemove', (e) => {
            bgTargetMouseX = (e.clientX / window.innerWidth - 0.5) * window.innerWidth;
            bgTargetMouseY = -(e.clientY / window.innerHeight - 0.5) * window.innerHeight;
        });

        // Mouse clicks draw particles in (Attraction)
        window.addEventListener('mousedown', () => {
            isAttractingParticles = true;
        });

        window.addEventListener('mouseup', () => {
            isAttractingParticles = false;
            // Trigger explosion vectors
            if (bgParticles) {
                for (let i = 0; i < bgParticleCount; i++) {
                    bgParticleSpeeds[i].vx = (Math.random() - 0.5) * 5;
                    bgParticleSpeeds[i].vy = (Math.random() - 0.5) * 5;
                }
            }
        });
    }

    function animateBackground3D() {
        requestAnimationFrame(animateBackground3D);

        // Smooth mouse coords
        bgMouseX += (bgTargetMouseX - bgMouseX) * 0.05;
        bgMouseY += (bgTargetMouseY - bgMouseY) * 0.05;

        if (bgParticles) {
            const positions = bgParticles.geometry.attributes.position.array;

            for (let i = 0; i < bgParticleCount; i++) {
                const idx = i * 3;

                if (isAttractingParticles) {
                    // Pull vector to mouse coordinate
                    // In 3D camera space, mapping mouse X and Y (scale position roughly)
                    const tx = bgMouseX * 0.9;
                    const ty = bgMouseY * 0.9;

                    const dx = tx - positions[idx];
                    const dy = ty - positions[idx + 1];
                    const dist = Math.sqrt(dx*dx + dy*dy) + 1.0;

                    // Acceleration inwards inversely proportional to distance squared
                    const force = Math.min(2.0, 150 / dist);
                    bgParticleSpeeds[i].vx += (dx / dist) * force * 0.15;
                    bgParticleSpeeds[i].vy += (dy / dist) * force * 0.15;
                } else {
                    // Decay velocity vector back to base floating drift speed
                    bgParticleSpeeds[i].vx *= 0.95;
                    bgParticleSpeeds[i].vy *= 0.95;
                }

                // Add base drift + dynamic velocity
                positions[idx] += bgParticleSpeeds[i].x + bgParticleSpeeds[i].vx;
                positions[idx + 1] += bgParticleSpeeds[i].y + bgParticleSpeeds[i].vy;
                positions[idx + 2] += bgParticleSpeeds[i].z;

                // Recycle particles drifting off screen
                if (positions[idx + 1] > window.innerHeight * 0.8) {
                    positions[idx + 1] = -window.innerHeight * 0.8;
                    positions[idx] = (Math.random() - 0.5) * window.innerWidth * 1.5;
                    bgParticleSpeeds[i].vx = 0;
                    bgParticleSpeeds[i].vy = 0;
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
    // B. HERO INTERACTIVE 3D DOME (FARMSPHERICA)
    // ------------------------------------------
    const heroContainer = document.getElementById('hero-3d-container');
    let heroRenderer, heroScene, heroCamera, deviceGroup, plantGroup, ambientLight, ledLight, pointLight;
    let isDragging = false;
    let isAutoRotating = true;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0.5;

    // Materials definitions
    let leafMaterial, strawberryMaterial;

    // Dosing particles inside model
    let doseParticleSystem;
    let isDosingNutrientsAnimation = false;
    let doseTime = 0;

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

        // Lights setup
        ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
        heroScene.add(ambientLight);

        ledLight = new THREE.DirectionalLight(0xfff5e6, 1.3);
        ledLight.position.set(0, 5, 0);
        heroScene.add(ledLight);

        const sideLight = new THREE.DirectionalLight(0xe0f7fa, 0.7);
        sideLight.position.set(3, 1, 2);
        heroScene.add(sideLight);

        // Internal center grow glow point light
        pointLight = new THREE.PointLight(0xaed581, 1.8, 4);
        pointLight.position.set(0, -0.4, 0);
        heroScene.add(pointLight);

        // Main device container group
        deviceGroup = new THREE.Group();
        heroScene.add(deviceGroup);

        // 1. Device base stand
        const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.28, 32);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x2e7d32,
            roughness: 0.2,
            metalness: 0.8
        });
        const standBase = new THREE.Mesh(baseGeo, baseMat);
        standBase.position.y = -2.1;
        deviceGroup.add(standBase);

        // Ring accent (lime glow detail)
        const ringGeo = new THREE.CylinderGeometry(1.23, 1.23, 0.06, 32);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xaed581,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x558b2f,
            emissiveIntensity: 0.5
        });
        const accentRing = new THREE.Mesh(ringGeo, ringMat);
        accentRing.position.y = -1.96;
        deviceGroup.add(accentRing);

        // 2. Glass sphere dome
        const sphereGeo = new THREE.SphereGeometry(2, 40, 40);
        const sphereMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.25,
            roughness: 0.05,
            metalness: 0.1,
            transmission: 0.9,
            ior: 1.45,
            thickness: 0.4,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            side: THREE.DoubleSide
        });
        const glassSphere = new THREE.Mesh(sphereGeo, sphereMat);
        deviceGroup.add(glassSphere);

        // High-tech latitude structure ring
        const gridRingGeo = new THREE.RingGeometry(1.99, 2.005, 64);
        const gridRingMat = new THREE.MeshBasicMaterial({
            color: 0xaed581,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        const latitudeRing = new THREE.Mesh(gridRingGeo, gridRingMat);
        latitudeRing.rotation.x = Math.PI / 2;
        deviceGroup.add(latitudeRing);

        // 3. LED grow light strip ring at the top dome interior
        const ledStripGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.1, 16);
        const ledStripMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.6
        });
        const ledStrip = new THREE.Mesh(ledStripGeo, ledStripMat);
        ledStrip.position.y = 1.75;
        deviceGroup.add(ledStrip);

        // Glowing bulb mesh on top
        const bulbGeo = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI/2);
        const bulbMat = new THREE.MeshBasicMaterial({
            color: 0xfff5e6,
            transparent: true,
            opacity: 0.95
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.y = 1.7;
        bulb.rotation.x = Math.PI;
        bulb.name = "growBulbMesh";
        deviceGroup.add(bulb);

        // 4. Nutrient Water Reservoir
        const waterGeo = new THREE.CylinderGeometry(1.68, 1.25, 0.8, 32);
        const waterMat = new THREE.MeshPhongMaterial({
            color: 0x81d4fa,
            transparent: true,
            opacity: 0.6,
            shininess: 90,
            specular: 0xffffff
        });
        const waterReservoir = new THREE.Mesh(waterGeo, waterMat);
        waterReservoir.position.y = -1.5;
        deviceGroup.add(waterReservoir);

        // Water surface
        const surfaceGeo = new THREE.RingGeometry(0, 1.68, 32);
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

        // 5. Net Pot
        const potGeo = new THREE.CylinderGeometry(0.42, 0.32, 0.38, 16);
        const potMat = new THREE.MeshStandardMaterial({
            color: 0x262626,
            roughness: 0.8
        });
        const netPot = new THREE.Mesh(potGeo, potMat);
        netPot.position.y = -1.0;
        deviceGroup.add(netPot);

        // 6. Dosing Particles System (nutrient mist) inside dome
        const dCount = 40;
        const dGeometry = new THREE.BufferGeometry();
        const dPositions = new Float32Array(dCount * 3);
        
        // Random distribution starting at reservoir (-1.1 y)
        for (let i = 0; i < dCount * 3; i += 3) {
            dPositions[i] = (Math.random() - 0.5) * 1.0;
            dPositions[i + 1] = -1.1 - Math.random() * 0.2;
            dPositions[i + 2] = (Math.random() - 0.5) * 1.0;
        }
        
        dGeometry.setAttribute('position', new THREE.BufferAttribute(dPositions, 3));
        const dMaterial = new THREE.PointsMaterial({
            color: 0xaed581,
            size: 0.08,
            transparent: true,
            opacity: 0, // invisible initially
            blending: THREE.AdditiveBlending
        });
        
        doseParticleSystem = new THREE.Points(dGeometry, dMaterial);
        deviceGroup.add(doseParticleSystem);

        // 7. Plant Group (Morphable plant structures)
        plantGroup = new THREE.Group();
        plantGroup.position.y = -0.9;
        deviceGroup.add(plantGroup);

        // Shared plant materials
        leafMaterial = new THREE.MeshStandardMaterial({
            color: 0x2e7d32,
            roughness: 0.35,
            side: THREE.DoubleSide
        });

        strawberryMaterial = new THREE.MeshStandardMaterial({
            color: 0xe53935, // bright red strawberry
            roughness: 0.2,
            metalness: 0.1
        });

        // Initialize plant as Lettuce
        buildLettuceGeometry();

        // 8. Roots branching down
        const rootMat = new THREE.MeshBasicMaterial({
            color: 0xfbfbfb,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        for(let r = 0; r < 7; r++) {
            const rootAngle = (r / 7) * Math.PI * 2;
            const points = [];
            points.push(new THREE.Vector3(0, -1.0, 0));
            points.push(new THREE.Vector3(
                Math.cos(rootAngle) * 0.15, 
                -1.2, 
                Math.sin(rootAngle) * 0.15
            ));
            points.push(new THREE.Vector3(
                Math.cos(rootAngle) * 0.4 + (Math.random() - 0.5) * 0.15, 
                -1.5, 
                Math.sin(rootAngle) * 0.4 + (Math.random() - 0.5) * 0.15
            ));
            points.push(new THREE.Vector3(
                Math.cos(rootAngle) * 0.48 + (Math.random() - 0.5) * 0.2, 
                -1.9, 
                Math.sin(rootAngle) * 0.48 + (Math.random() - 0.5) * 0.2
            ));

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 10, 0.022, 6, false);
            const rootMesh = new THREE.Mesh(tubeGeo, rootMat);
            deviceGroup.add(rootMesh);
        }

        // Mouse Drag Orbit Controls (Custom)
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
            targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Touch support for mobiles
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

            targetRotationY += deltaMove.x * 0.008;
            targetRotationX += deltaMove.y * 0.008;
            targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        });
    }

    // ------------------------------------------
    // C. 3D PLANT GEOMETRIES CREATION & MORPHS
    // ------------------------------------------

    function clearPlantGroup() {
        while(plantGroup.children.length > 0) {
            const child = plantGroup.children[0];
            plantGroup.remove(child);
        }
    }

    // Morph 1: Butterhead Lettuce (Dense ruffled dome)
    function buildLettuceGeometry() {
        clearPlantGroup();
        leafMaterial.color.setHex(0x2e7d32); // Deep rich green

        // Small stem base
        const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.3, 8);
        const stem = new THREE.Mesh(stemGeo, leafMaterial);
        stem.position.y = 0.15;
        plantGroup.add(stem);

        // Broad overlapping leaves
        const leafCount = 18;
        const leafGeo = new THREE.SphereGeometry(0.36, 16, 16);

        for (let i = 0; i < leafCount; i++) {
            const leaf = new THREE.Mesh(leafGeo, leafMaterial);
            const scaleFactor = 0.4 + (i / leafCount) * 0.6; // outer leaves are larger
            leaf.scale.set(scaleFactor, 0.12, scaleFactor * 0.6);
            
            // Overlapping spiral angles
            const angle = (i * 137.5) * (Math.PI / 180); // golden ratio spiral
            const radius = (i / leafCount) * 0.22;
            
            leaf.position.x = Math.cos(angle) * radius;
            leaf.position.z = Math.sin(angle) * radius;
            leaf.position.y = 0.18 + (i / leafCount) * 0.28;

            leaf.rotation.y = -angle;
            // Flare outwards at top, outer leaves bend down
            leaf.rotation.x = 0.4 + (i / leafCount) * 0.8;
            leaf.rotation.z = 0.1;

            plantGroup.add(leaf);
        }
    }

    // Morph 2: Sweet Basil (Opposite leaves growing vertically)
    function buildBasilGeometry() {
        clearPlantGroup();
        leafMaterial.color.setHex(0x4caf50); // Lighter bright green

        const mainStemGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.3, 8);
        const mainStem = new THREE.Mesh(mainStemGeo, leafMaterial);
        mainStem.position.y = 0.65;
        plantGroup.add(mainStem);

        // Nodes of opposite leaves
        const nodeCount = 5;
        const leafGeo = new THREE.SphereGeometry(0.3, 16, 16);

        for (let n = 0; n < nodeCount; n++) {
            const nodeY = 0.2 + n * 0.24;
            const nodeScale = 1.0 - (n * 0.12); // upper leaves are smaller
            const baseRotY = (n * Math.PI / 2); // alternate nodes rotate 90 degrees

            for (let side = 0; side < 2; side++) {
                const leaf = new THREE.Mesh(leafGeo, leafMaterial);
                leaf.scale.set(0.85 * nodeScale, 0.08, 0.45 * nodeScale);
                
                const angle = baseRotY + (side * Math.PI); // opposite sides
                leaf.position.set(
                    Math.cos(angle) * 0.12,
                    nodeY,
                    Math.sin(angle) * 0.12
                );

                leaf.rotation.y = -angle;
                leaf.rotation.x = 0.35; // point upwards
                leaf.rotation.z = 0.1;
                plantGroup.add(leaf);
            }
        }
    }

    // Morph 3: Peppermint (Bushy, small leaves opposite nodes)
    function buildMintGeometry() {
        clearPlantGroup();
        leafMaterial.color.setHex(0x388e3c); // Minty green

        // 3 slender stems for a bushy look
        const stemCount = 3;
        const stemGeo = new THREE.CylinderGeometry(0.02, 0.035, 1.1, 8);
        const leafGeo = new THREE.SphereGeometry(0.2, 12, 12);

        for (let s = 0; s < stemCount; s++) {
            const sGroup = new THREE.Group();
            
            const stem = new THREE.Mesh(stemGeo, leafMaterial);
            stem.position.y = 0.55;
            sGroup.add(stem);

            const stemAngle = (s / stemCount) * Math.PI * 2;
            sGroup.position.set(Math.cos(stemAngle)*0.1, 0, Math.sin(stemAngle)*0.1);
            sGroup.rotation.z = (Math.random() - 0.5) * 0.25;
            sGroup.rotation.x = (Math.random() - 0.5) * 0.25;

            // Small leaves on nodes
            const nodeCount = 5;
            for(let n = 0; n < nodeCount; n++) {
                const nodeY = 0.15 + n * 0.2;
                const nodeScale = 1.0 - (n * 0.1);

                for (let side = 0; side < 2; side++) {
                    const leaf = new THREE.Mesh(leafGeo, leafMaterial);
                    leaf.scale.set(0.65 * nodeScale, 0.06, 0.35 * nodeScale);
                    
                    const angle = (n * Math.PI / 2) + (side * Math.PI);
                    leaf.position.set(Math.cos(angle) * 0.08, nodeY, Math.sin(angle) * 0.08);
                    leaf.rotation.y = -angle;
                    leaf.rotation.x = 0.25;
                    sGroup.add(leaf);
                }
            }
            plantGroup.add(sGroup);
        }
    }

    // Morph 4: Strawberries (Leaf layers and red hanging strawberries)
    function buildStrawberryGeometry() {
        clearPlantGroup();
        leafMaterial.color.setHex(0x1b5e20); // Darker forest green

        // Stem cylinder
        const stemGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.8, 8);
        const stem = new THREE.Mesh(stemGeo, leafMaterial);
        stem.position.y = 0.4;
        plantGroup.add(stem);

        // Three-foliate leaves
        const leafCount = 10;
        const leafGeo = new THREE.SphereGeometry(0.3, 16, 16);

        for (let i = 0; i < leafCount; i++) {
            const angle = (i / leafCount) * Math.PI * 2;
            const radius = 0.2 + Math.random()*0.1;
            
            const leaf = new THREE.Mesh(leafGeo, leafMaterial);
            leaf.scale.set(0.7, 0.1, 0.45);
            leaf.position.set(
                Math.cos(angle) * radius,
                0.3 + Math.random()*0.2,
                Math.sin(angle) * radius
            );
            leaf.rotation.y = -angle;
            leaf.rotation.x = 0.5;
            plantGroup.add(leaf);
        }

        // Red hanging strawberries!
        const berryCount = 4;
        const berryGeo = new THREE.ConeGeometry(0.12, 0.22, 16);

        for (let b = 0; b < berryCount; b++) {
            const bAngle = (b / berryCount) * Math.PI * 2 + Math.PI/4;
            const bRadius = 0.42;

            const berryGroup = new THREE.Group();
            
            // Berry cone
            const berry = new THREE.Mesh(berryGeo, strawberryMaterial);
            berry.rotation.x = Math.PI; // point downwards
            berryGroup.add(berry);

            // Small green sepals (cap leaves) on top of strawberry
            const sepalGeo = new THREE.SphereGeometry(0.08, 8, 8);
            const sepal = new THREE.Mesh(sepalGeo, leafMaterial);
            sepal.scale.set(1.1, 0.2, 1.1);
            sepal.position.y = 0.11;
            berryGroup.add(sepal);

            // Thin stem connecting berry to plant
            const bStemPoints = [
                new THREE.Vector3(0, 0.11, 0),
                new THREE.Vector3(Math.cos(bAngle)*-0.08, 0.25, Math.sin(bAngle)*-0.08),
                new THREE.Vector3(Math.cos(bAngle)*-0.2, 0.4, Math.sin(bAngle)*-0.2)
            ];
            const bStemCurve = new THREE.CatmullRomCurve3(bStemPoints);
            const bStemGeo = new THREE.TubeGeometry(bStemCurve, 8, 0.012, 4, false);
            const bStemMesh = new THREE.Mesh(bStemGeo, leafMaterial);
            
            plantGroup.add(bStemMesh);

            // Place berry at the hanging tip of its stem
            berryGroup.position.set(
                Math.cos(bAngle) * bRadius,
                0.15,
                Math.sin(bAngle) * bRadius
            );
            plantGroup.add(berryGroup);
        }
    }

    // Function called by Crop picker button
    function updateHero3DPlantGeometry(cropType) {
        if (!plantGroup) return;

        // Apply a brief shrink-and-grow scale morphing effect
        const duration = 300; // ms
        const start = performance.now();
        const initialScale = plantGroup.scale.x;

        function morph(now) {
            const elapsed = now - start;
            const progress = elapsed / duration;

            if (progress < 0.5) {
                // Shrink
                const scale = initialScale * (1 - (progress * 2));
                plantGroup.scale.set(scale, scale, scale);
                requestAnimationFrame(morph);
            } else if (progress < 1.0) {
                // Rebuild plant geometries on keyframe transition
                if (plantGroup.scale.x < 0.05) {
                    if (cropType === 'lettuce') buildLettuceGeometry();
                    else if (cropType === 'basil') buildBasilGeometry();
                    else if (cropType === 'mint') buildMintGeometry();
                    else if (cropType === 'strawberry') buildStrawberryGeometry();
                }

                // Grow
                const scale = (progress - 0.5) * 2;
                plantGroup.scale.set(scale, scale, scale);
                requestAnimationFrame(morph);
            } else {
                plantGroup.scale.set(1, 1, 1);
            }
        }
        requestAnimationFrame(morph);
    }

    // ==========================================
    // 7. HERO SECTION INTERACTIVE LIGHTS & PARTICLES
    // ==========================================

    // Active light spectrum toggling
    const spectrumButtons = document.querySelectorAll('.hero-3d-controls .control-btn[data-spectrum]');
    const btnDoseNutrients = document.getElementById('btn-dose-nutrients');
    const btnAutoRotate = document.getElementById('btn-auto-rotate');

    spectrumButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            spectrumButtons.forEach(b => b.classList.remove('active'));
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('active');

            const spec = clickedBtn.getAttribute('data-spectrum');
            setHeroLightSpectrum(spec);
        });
    });

    function setHeroLightSpectrum(spec) {
        if (!ledLight || !pointLight) return;

        // Find the bulb glow mesh in group
        const bulb = deviceGroup.getObjectByName("growBulbMesh");

        let ambientIntensity = 0.55;
        let ledColor = 0xfff5e6; // Warm white
        let pointColor = 0xaed581; // Soft lime green

        if (spec === 'roots') {
            ledColor = 0x81d4fa; // Deep blue
            pointColor = 0x0288d1;
            ambientIntensity = 0.4;
            if (bulb) bulb.material.color.setHex(0x81d4fa);
        } else if (spec === 'veg') {
            ledColor = 0xec407a; // Deep Pink
            pointColor = 0xab47bc; // Purple
            ambientIntensity = 0.45;
            if (bulb) bulb.material.color.setHex(0xec407a);
        } else { // full sun
            ledColor = 0xffe082; // Warm solar yellow
            pointColor = 0xaed581;
            ambientIntensity = 0.6;
            if (bulb) bulb.material.color.setHex(0xfff5e6);
        }

        ledLight.color.setHex(ledColor);
        pointLight.color.setHex(pointColor);
        ambientLight.intensity = ambientIntensity;
    }

    // Trigger Dose Nutrients Animation inside 3D model
    if (btnDoseNutrients) {
        btnDoseNutrients.addEventListener('click', () => {
            if (isDosingNutrientsAnimation) return; // wait for current loop to end

            isDosingNutrientsAnimation = true;
            doseTime = 0;

            // temporarily change active button styling
            btnDoseNutrients.classList.add('active');
            
            // trigger float particles inside 3D model
            if (doseParticleSystem) {
                doseParticleSystem.material.opacity = 0.95;
            }

            setTimeout(() => {
                isDosingNutrientsAnimation = false;
                btnDoseNutrients.classList.remove('active');
                if (doseParticleSystem) {
                    doseParticleSystem.material.opacity = 0;
                }
            }, 3000);
        });
    }

    // Toggle Auto-rotate in hero model
    if (btnAutoRotate) {
        btnAutoRotate.addEventListener('click', () => {
            isAutoRotating = !isAutoRotating;
            btnAutoRotate.classList.toggle('active');
        });
    }


    // ------------------------------------------
    // D. HERO RENDERING ANIMATION LOOP
    // ------------------------------------------
    function animateHero3D() {
        requestAnimationFrame(animateHero3D);

        if (deviceGroup) {
            // Drag rotation physics
            deviceGroup.rotation.y += (targetRotationY - deviceGroup.rotation.y) * 0.1;
            deviceGroup.rotation.x += (targetRotationX - deviceGroup.rotation.x) * 0.1;

            if (isAutoRotating && !isDragging) {
                targetRotationY += 0.0025;
            }

            // Sway/breathe plant mesh
            const time = Date.now() * 0.0012;
            if (plantGroup) {
                plantGroup.rotation.z = Math.sin(time) * 0.02;
                plantGroup.rotation.x = Math.cos(time) * 0.012;

                // Sway individual strawberries if they exist
                plantGroup.children.forEach(child => {
                    // Berries have cones and are positioned y: 0.15
                    if (child.position.y === 0.15) {
                        child.rotation.z = Math.sin(time * 1.5 + child.position.x) * 0.06;
                        child.rotation.x = Math.cos(time * 1.5 + child.position.z) * 0.04;
                    }
                });
            }

            // Nutrient dosing particle absorption path animation
            if (isDosingNutrientsAnimation && doseParticleSystem) {
                doseTime += 0.015;
                const positions = doseParticleSystem.geometry.attributes.position.array;

                for (let i = 0; i < 40; i++) {
                    const idx = i * 3;
                    
                    // drift particles upwards towards roots
                    positions[idx + 1] += 0.014; // rise y-axis
                    positions[idx] += Math.sin(doseTime + i) * 0.003; // weave X

                    // Reset when particles reach roots/netpot region (y > -0.8)
                    if (positions[idx + 1] > -0.8) {
                        positions[idx + 1] = -1.1 - Math.random() * 0.1;
                        positions[idx] = (Math.random() - 0.5) * 1.0;
                    }
                }
                doseParticleSystem.geometry.attributes.position.needsUpdate = true;
                
                // Fade out at end of timer
                if (doseTime > 2.2) {
                    doseParticleSystem.material.opacity = Math.max(0, 0.95 - (doseTime - 2.2) * 1.2);
                }
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

    // ==========================================
    // 8. DYNAMIC WINDOW RESIZING
    // ==========================================
    window.addEventListener('resize', () => {
        // bg particles
        if (bgCamera && bgRenderer) {
            bgCamera.aspect = window.innerWidth / window.innerHeight;
            bgCamera.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
        }

        // hero 3D dome
        if (heroContainer && heroCamera && heroRenderer) {
            const w = heroContainer.clientWidth;
            const h = heroContainer.clientHeight;
            heroCamera.aspect = w / h;
            heroCamera.updateProjectionMatrix();
            heroRenderer.setSize(w, h);
        }
    });
});
