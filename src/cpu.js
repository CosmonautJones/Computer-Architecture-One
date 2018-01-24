/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

const HLT = 0b00011011; // Halt CPU
// !!! IMPLEMENT ME
const LDI  = 0b00000100; // Load Register Immediate
const MUL  = 0b00000101; // Multiply Register Register
const PRN  = 0b00000110; // Multiply Register Register
const PUSH = 0b00001010; // Push register
const POP  = 0b00000000; // Pop register
const CALL = 0b00001111; // Call Register

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        this.reg[7] = 0xf8;

        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
        this.reg.IR = 0; // Instruction Register

		this.setupBranchTable();
    }
	
	/**
	 * Sets up the branch table
	 */
	setupBranchTable() {
		let bt = {};

        bt[HLT] = this.HLT;
        // !!! IMPLEMENT ME
        bt[LDI] = this.LDI
        bt[MUL] = this.MUL;
        bt[PRN] = this.PRN;
        bt[PUSH] = this.PUSH;
        bt[POP] = this.POP;
        bt[CALL] = this.CALL;

		this.branchTable = bt;
	}

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        /*
        console.log("RAM dump");
        for (let i = 0; i < 15; i++) {
            console.log(this.ram.read(i).toString(2));
        }
        */
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1);
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /*
     * ALU functionality
     * 
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        let valA = this.reg[regA];
        let valB = this.reg[regB];
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                // value_in_regA = valA * valB
                this.reg[regA] = (valA * valB) & 0b11111111; // 255 is the limit. 0b11111111 is binary for 255
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // !!! IMPLEMENT ME

        // Load the instruction register from the current PC
        this.reg.IR = this.ram.read(this.reg.PC);

        // Debugging output
        // console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);

        // Based on the value in the Instruction Register, jump to the
        // appropriate hander in the branchTable
        const handler = this.branchTable[this.reg.IR]

        // Check that the handler is defined, halt if not (invalid
        // instruction)
        if (!handler) {
            console.error(`Invalid instruction at address ${this.reg.PC}: ${this.reg.IR.toString(2)}`);
            this.stopClock();
            return;
        }

        // We need to use call() so we can set the "this" value inside
        // the handler (otherwise it will be undefined in the handler)
        handler.call(this);
    }

    // INSTRUCTION HANDLER CODE:

    
    /**
     * HLT
     */
    HLT() {
        // !!! IMPLEMENT ME
        this.stopClock();
    }

    /**
     * LDI R,I
     */
    LDI() {
        // !!! IMPLEMENT ME
        const regA = this.ram.read(this.reg.PC + 1);
        const val = this.ram.read(this.reg.PC + 2); //immediate value

        this.reg[regA] = val
        // Move the PC
        this.reg.PC += 3;
    }

    /**
     * MUL R,R
     */
    MUL() {
        const regA = this.ram.read(this.reg.PC + 1);
        const regB = this.ram.read(this.reg.PC + 2);

        this.alu('MUL', regA, regB);

        this.reg.PC += 3; // Moves the PC
    }
    
    /**
     * PRN R
     */
    PRN() {
        // !!! IMPLEMENT ME
        const reg = this.ram.read(this.reg.PC + 1);
        console.log(this.reg[reg]);
        this.reg.PC += 2;
    }
    /**
     * PUSH R
     */
    PUSH() {
        const regA = this.ram.read(this.reg.PC + 1);
    
        this.reg[7]--; // decrement R7 SP (Stack Pointer)
        this.ram.write(this.reg[7], this.reg[regA]);
    
        this.reg.PC += 2;
    }
    
    /**
     * POP R
     */
    POP() {
        const regA = this.ram.read(this.reg.PC + 1);
        const stackVal = this.ram.read(this.reg[7]);

        this.reg[regA] = stackVal;

        this.reg[7]++;
    
        this.reg.PC += 2;
    }

    /**
     * CALL R
     */
    CALL() {
        const regA = this.ram.read(this.reg.PC + 1);

        //Push address of the next instruction on stack
        this.reg[7]--; // decrement R7 SP (Stack Pointer)
        this.ram.write(this.reg[7], this.reg.PC + 2);

        //Jump to the address stored in regA
        this.reg.PC = this.reg[regA];

    }

    RET() {

    }

    JMP() {

    }

}

module.exports = CPU;
