const input = document.getElementById('cmd-input') as HTMLInputElement;
const output = document.getElementById('output') as HTMLDivElement;
const promptSpan = document.querySelector('.input-line .prompt') as HTMLSpanElement;

async function updatePrompt() 
{
    const cwd = await (window as any).electronAPI.getPwd();
    promptSpan.innerText = `${cwd}>`;
    return promptSpan.innerText;
}

updatePrompt();

input.addEventListener('keydown', async (e) => 
{
    if (e.key === 'Enter') 
    {
        const commandText = input.value;
        input.value = '';

        const currentPrompt = promptSpan.innerText;

        output.innerHTML += `<div><span class="prompt">${currentPrompt}</span> ${commandText}</div>`;

        const response = await (window as any).electronAPI.sendCommand(commandText);
        
        output.innerHTML += `<div class="response">${response}</div>`;
        output.scrollTop = output.scrollHeight;

        await updatePrompt();
    }
});