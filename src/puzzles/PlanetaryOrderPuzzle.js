import * as THREE from 'three';
import Planet from './Planet.js';

class PlanetaryOrderPuzzle {
    constructor() {
        this.group = new THREE.Group();

        const loader = new THREE.TextureLoader();
        const loadSurface = (name) => {
            const texture = loader.load(
                `textures/${name}.jpg`,
                undefined,
                undefined,
                (error) => console.error(`Failed to load planet texture: ${name}`, error)
            );
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        };
        const surfaces = {
            mercury: loadSurface('mercury'),
            venus: loadSurface('venus'),
            earth: loadSurface('earth'),
            mars: loadSurface('mars'),
            jupiter: loadSurface('jupiter'),
            saturn: loadSurface('saturn'),
            uranus: loadSurface('uranus'),
            neptune: loadSurface('neptune'),
        };

        this.planets = [
            new Planet('Mercury', surfaces['mercury'], 0xaaaaaa, 0.17),
            new Planet('Venus', surfaces['venus'], 0xffcc66, 0.18),
            new Planet('Earth', surfaces['earth'], 0x3366ff, 0.18),
            new Planet('Mars', surfaces['mars'], 0xff5533, 0.18),
            new Planet('Jupiter', surfaces['jupiter'], 0xd6a56e, 0.24),
            new Planet('Saturn', surfaces['saturn'], 0xe6d39b, 0.23),
            new Planet('Uranus', surfaces['uranus'], 0x78d4d2, 0.22),
            new Planet('Neptune', surfaces['neptune'], 0x3659c9, 0.22),
        ];

        this.correctOrder = [
            'Mercury',
            'Venus',
            'Earth',
            'Mars',
            'Jupiter',
            'Saturn',
            'Uranus',
            'Neptune'
        ];

        // Initial shuffled arrangement
        this.currentOrder = [
            this.planets[6],
            this.planets[0],
            this.planets[3],
            this.planets[2],
            this.planets[1],
            this.planets[4],
            this.planets[7],
            this.planets[5],
        ];

        this.selectedPlanet = null;
        this.solved = false;
        this.onSolved = null;

        this.spacing = 0.8;
        this.group.userData = {
            isPuzzle: true,
            puzzleKind: 'planetary-order',
            hint: '🪐 Tukar posisi planet hingga berurutan dari Matahari'
        };

        this.currentOrder.forEach((planet, index) => {
            this.group.add(planet.mesh);
        });

        this.updatePositions();
    }

    updatePositions() {
        const offset = (this.currentOrder.length - 1) / 2;

        this.currentOrder.forEach((planet, index) => {
            planet.setPosition(
                new THREE.Vector3(
                    (index - offset) * this.spacing,
                    0,
                    0
                )
            );
        });
    }

    handleInput(planetName) {
        if (this.solved) return;

        const planet = this.planets.find(
            planet => planet.name === planetName
        );

        if (!planet) return;

        // First selection
        if (this.selectedPlanet === null) {
            this.selectedPlanet = planet;
            planet.highlight();
            return;
        }

        // Clicking the same planet deselects it
        if (this.selectedPlanet === planet) {
            planet.unhighlight();
            this.selectedPlanet = null;
            return;
        }

        // Second selection: swap planets
        this.swapPlanets(this.selectedPlanet, planet);

        this.selectedPlanet.unhighlight();
        this.selectedPlanet = null;

        if (this.checkSolution()) {
            this.complete();
        }
    }

    swapPlanets(planetA, planetB) {
        const indexA = this.currentOrder.indexOf(planetA);
        const indexB = this.currentOrder.indexOf(planetB);

        [this.currentOrder[indexA], this.currentOrder[indexB]] =
            [this.currentOrder[indexB], this.currentOrder[indexA]];

        this.updatePositions();
    }

    checkSolution() {
        return this.currentOrder.every(
            (planet, index) =>
                planet.name === this.correctOrder[index]
        );
    }

    complete() {
        this.solved = true;
        this.onSolved?.();
    }

    reset() {
        this.selectedPlanet?.unhighlight();
        this.selectedPlanet = null;

        this.currentOrder = [
            this.planets[6],
            this.planets[0],
            this.planets[3],
            this.planets[2],
            this.planets[1],
            this.planets[4],
            this.planets[7],
            this.planets[5],
        ];

        this.solved = false;
        this.updatePositions();
    }
}

export default PlanetaryOrderPuzzle;