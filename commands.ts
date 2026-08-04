import * as process from 'node:process';
import fs, { Utf8Stream } from 'node:fs';

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

export function rm(file?: string)
{
    const filePath = process.cwd() + "/" + file;

    fs.rm(filePath, (error) => 
    {
        if (error) console.error(error.message);
    });
}

export function cp(file1?: string, file2?: string)
{
    const pwd = process.cwd() + "/";
    fs.cpSync(pwd + file1, pwd + file2);
}

export function cat(file?: string)
{
    console.log(fs.readFileSync(process.cwd() + "/" + file).toString('utf8'));
}

export function grep(text?: string, file?: string)
{
    if (!text) return;
    
    const source = fs.readFileSync(process.cwd() + "/" + file).toString('utf8');
    const split = source.split("\n");
    
    for (const item of split)
    {
        if (item.includes(text))
        {
            console.log(`Line (${split.indexOf(item) + 1}): ${item}`);
        }
    }
}