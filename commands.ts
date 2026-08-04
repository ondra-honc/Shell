import * as process from 'node:process';
import fs from 'node:fs';

export function exit()
{
    process.exit(0);
}

export function cd(input?: string)
{
    const targetDir = input || process.env.HOME || "/";
    try
    {
        process.chdir(targetDir);
    } catch (error: any)
    {
        console.log("System can not find the targeted directory");
    }
}

export function mkdir(input?: string)
{
    const dirName = input;
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
}

export function echo(input?: string, fileName?: string)
{
    if (!input) 
    {
        console.log(); 
        return;
    }

    if (!fileName) 
    {
        console.log(input);
        return;
    }
    
    const textToWrite = input!;
    const file = process.cwd() + "/" + fileName;
            
    try
    {
        fs.writeFileSync(file, textToWrite);

    } catch(error: any)
    {
        console.error(error);
    }
}

export function ls()
{
    for (const item of fs.readdirSync(process.cwd() + "/"))
    {
        console.log(item);
    }
}

export function touch(file?: string)
{
    fs.writeFileSync(process.cwd() + "/" + file, "");
}