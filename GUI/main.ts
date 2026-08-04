import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as shell from '../commands.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() 
{
    const win = new BrowserWindow(
    {
        width: 1100,
        height: 620,
        title: "TS-OS Shell",
        webPreferences: 
        {
            preload: path.join(__dirname, 'preload.cjs'),
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle('run-command', async (_event, input: string) => 
{
    const trimmed = input.trim();
    if (!trimmed) return '';

    const [cmd, ...args] = trimmed.split(/\s+/);

    if(!cmd) return;

    const fn = (shell as Record<string, any>)[cmd];

    if (typeof fn !== 'function') 
    {
        return `Command not found: ${cmd}`;
    }

    let output = '';
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...msg: any[]) => { output += msg.join(' ') + '\n'; };
    console.error = (...msg: any[]) => { output += msg.join(' ') + '\n'; };

    try 
    {
        const result = await fn(...args);
        if (result !== undefined) {
            output += String(result) + '\n';
        }
    } catch (err: any) {
        output += `Error: ${err.message || err}\n`;
    } finally {
        console.log = originalLog;
        console.error = originalError;
    }

    return output;
});

ipcMain.handle('get-pwd', () => 
{
    return process.cwd();
});