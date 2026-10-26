import SimonButton from './SimonButton.js';

class SimonPuzzle {
    constructor(buttons) {
        this.buttons = buttons;

        this.sequence = [];
        this.playerSequence = [];

        this.round = 0;
        this.maxRounds = 4;

        this.state = 'idle';
        this.solved = false;
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
    }

    reset() {
        this.sequence = [];
        this.playerSequence = [];
        this.round = 0;
        this.state = 'idle';
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default SimonPuzzle;