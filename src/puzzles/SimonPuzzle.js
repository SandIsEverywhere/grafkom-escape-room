import * as THREE from 'three';
import SimonButton from './SimonButton.js';

class SimonPuzzle {
    constructor() {
        this.group = new THREE.Group();

        this.buttons = [
            new SimonButton(0xff0000, new THREE.Vector3(-0.5, 0.5, 0)),
            new SimonButton(0x00ff00, new THREE.Vector3(0.5, 0.5, 0)),
            new SimonButton(0x0000ff, new THREE.Vector3(-0.5, -0.5, 0)),
            new SimonButton(0xffff00, new THREE.Vector3(0.5, -0.5, 0)),
        ];

        this.buttons.forEach((button, index) => {
            button.mesh.userData.buttonIndex = index;
            this.group.add(button.mesh);
        });

        this.sequence = [];
        this.playerSequence = [];
        this.round = 0;
        this.maxRounds = 4;
        this.state = 'idle';
        this.solved = false;
        this.onSolved = null;
        this.group.userData = {
            isPuzzle: true,
            puzzleKind: 'simon',
            hint: '🎵 Klik tombol untuk memulai, lalu ulangi urutan cahayanya'
        };
    }

    async start() {
        if (this.state !== 'idle') return;

        this.nextRound();
        await this.playSequence();
    }

    nextRound() {
        this.round++;
        this.playerSequence = [];

        const next = Math.floor(
            Math.random() * this.buttons.length
        );

        this.sequence.push(next);
    }

    async playSequence() {
        this.state = 'showing';

        await this.wait(500);

        for (const index of this.sequence) {
            const button = this.buttons[index];

            button.lightUp();
            await this.wait(500);

            button.dim();
            await this.wait(250);
        }

        this.state = 'input';
    }

    async handleInput(index) {
        if (this.state !== 'input') return;

        const button = this.buttons[index];

        button.lightUp();
        setTimeout(() => button.dim(), 200);

        const expected = this.sequence[this.playerSequence.length];

        if (index !== expected) {
            this.reset();
            return;
        }

        this.playerSequence.push(index);

        if (this.playerSequence.length === this.sequence.length) {
            if (this.round >= this.maxRounds) {
                this.complete();
            } else {
                this.state = 'transition';
                await this.wait(700);

                this.nextRound();
                await this.playSequence();
            }
        }
    }

    complete() {
        this.state = 'solved';
        this.solved = true;
        this.onSolved?.();
    }

    reset() {
        this.buttons.forEach(button => button.dim());
        this.sequence = [];
        this.playerSequence = [];
        this.round = 0;
        this.state = 'idle';
        this.solved = false;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default SimonPuzzle;