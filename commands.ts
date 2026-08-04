import * as process from 'node:process';
import fs from 'node:fs';
import * as os from 'node:os';
import path from 'node:path';

export function exit()
{
    process.exit(0);
}

export function cd(file?: string)
{
    const targetDir = file || os.homedir();
    try
    {
        process.chdir(targetDir);
    } catch (error: any)
    {
        console.log("System can not find the targeted directory");
    }
}

export function mkdir(file?: string)
{
    if (!file) return;

    try
    {
        const folderName = path.resolve(process.cwd(), file);
        if (!fs.existsSync(folderName))
        {
            fs.mkdirSync(folderName, { recursive: true });
        } else
        {
            console.log("A directory with that name already exists");
        }
    } catch(error: any)
    {
        console.error(error.message);
    }
}

export function echo(input?: string, fileName?: string)
{
    if (!input) { console.log(); return; }
    if (!fileName) { console.log(input); return; }
    
    try
    {
        const textToWrite = input!;
        const file = path.resolve(process.cwd(), fileName);
        fs.writeFileSync(file, textToWrite);

    } catch(error: any)
    {
        console.error(error.message);
    }
}

export function ls()
{
    try {
        for (const item of fs.readdirSync(process.cwd()))
        {
            console.log(item);
        }
    } catch (error: any) {
        console.error(`ls: cannot access directory: ${error.message}`);
    }
}

export function touch(file?: string)
{
    if (!file) return;
    
    try {
        const filePath = path.resolve(process.cwd(), file);
        const handle = fs.openSync(filePath, 'a');
        fs.closeSync(handle);
    } catch (error: any) {
        console.error(`touch: cannot touch '${file}': ${error.message}`);
    }
}

export function rm(file?: string)
{
    if (!file) return;

    try {
        const filePath = path.resolve(process.cwd(), file);
        fs.rm(filePath, { recursive: true, force: true }, (error) => 
        {
            if (error) console.error(error.message);
        });
    } catch (error: any) {
        console.error(error.message);
    }
}

export function cp(file1?: string, file2?: string)
{
    if (!file1 || !file2)
    {
        console.error("Source and destination files must be specified");
        return;
    }

    try {
        fs.cpSync(path.resolve(process.cwd(), file1), path.resolve(process.cwd(), file2));
    } catch (error: any) {
        console.error(error.message);
    }
}

export function cat(file?: string)
{
    if (!file) {
        console.error("No file specified");
        return;
    }

    try {
        console.log(fs.readFileSync(path.resolve(process.cwd(), file)).toString('utf8'));
    } catch (error: any) {
        console.error(`cat: ${file}: No such file or directory`);
    }
}

export function grep(text?: string, file?: string)
{
    if (!text || !file) return;
    
    try {
        const source = fs.readFileSync(path.resolve(process.cwd(), file)).toString('utf8');
        const split = source.split("\n");
        
        split.forEach((item, index) => 
        {
            if (item.includes(text))
            {
                console.log(`Line (${index + 1}): ${item}`);
            }
        });
    } catch (error: any) {
        console.error(`grep: ${file}: No such file or directory`);
    }
}

let lastCpus = os.cpus();

export function top()
{
    const currentCpus = os.cpus();

    const cpuUsage = currentCpus.map((currentCpu, i) => {
        const prevCpu = lastCpus[i];
        if (!prevCpu) return 0;

        const currentTotal = Object.values(currentCpu.times).reduce((acc, tv) => acc + tv, 0);
        const prevTotal = Object.values(prevCpu.times).reduce((acc, tv) => acc + tv, 0);

        const totalDiff = currentTotal - prevTotal;
        const idleDiff = currentCpu.times.idle - prevCpu.times.idle;

        return totalDiff > 0 ? Math.round(((totalDiff - idleDiff) / totalDiff) * 100) : 0;
    });

    lastCpus = currentCpus;

    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();

    console.log(`
    CPU Usage Per Thread (%): ${cpuUsage.join(', ')}
    Free Memory (MB): ${Math.round(freeMemory / 1024 / 1024)}
    Total Memory (MB): ${Math.round(totalMemory / 1024 / 1024)}
    Memory Usage (%): ${Math.round(((totalMemory - freeMemory) / totalMemory) * 100)}
    Uptime (Hours): ${(os.uptime() / 3600).toFixed(2)}
    `);
}