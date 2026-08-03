import * as readline from 'node:readline';
import { spawn } from 'node:child_process';
import * as process from 'node:process';
import fs from 'node:fs';

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

    if (command === "exit")
    {
        rl.close();
        process.exit(0);
    }

    if (command === "cd")
    {
        const targetDir = args[0] || process.env.HOME || "/";
        try
        {
            process.chdir(targetDir);
        } catch (error: any)
        {
            console.log("System can not find the targeted directory");
        }
        prompt();
        return;
    }

    if (command === "mkdir")
    {
        const dirName = args[0]
        if (!dirName) return;

        try
        {
            const folderName = process.cwd() + "/" + dirName;
            if (!fs.existsSync(folderName))
            {
                fs.mkdirSync(folderName);
            } else
            {
                console.log("A directory with that name already exists");
            }
        } catch(error: any)
        {
            console.error(error);
        }
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