import * as readline from 'node:readline';
import { spawn } from 'node:child_process';
import * as process from 'node:process';

import { exit, cd, mkdir, echo, ls, touch, rm, cp } from './commands.js';


const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout,
    }
);

function prompt(): void
{
    const pwd: string = process.cwd();
    rl.question(pwd + ">", (input) => 
    {
        handleInput(input.trim());
    });
}


function handleInput(s: string)
{
    if (!s) 
    {
        prompt();
        return;
    }

    const args = s.split(/\s+/);
    const command = args.shift()!;

    switch (command) {
        case "exit":
            rl.close();
            exit();
            return;

        case "cd":
            cd(args[0]);
            prompt(); 
            return;

        case "mkdir":
            mkdir(args[0]);
            prompt(); 
            return;

        case "echo":
            echo(args[0], args[2]);
            prompt(); 
            return;

        case "pwd":
            console.log(process.cwd());
            prompt();
            return;

        case "ls":
            ls();
            prompt();
            return;   
            
        case "touch":
            touch(args[0]);
            prompt();
            return;

        case "rmdir":
            rm(args[0]);
            prompt();
            return;
        
        case "cp":
            cp(args[0], args[1])
            prompt();
            return;
    }

    const child = spawn(command, args, 
    {
        stdio: 'inherit',
        shell: false,
    });

    child.on("error", (error) => 
    {
        console.log(`Prompt failed ${error.message}`);
    });

    child.on("close", () =>
    {
        prompt();
    });
}

console.log("TypeScript Shell");
prompt();