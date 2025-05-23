const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
document.addEventListener('mousedown', async function (event) {
    if (event.button === 2) {
        const textarea = await navigator.clipboard.readText();
        const lines = textarea.split(/\r?\n/);
        const links = lines
                        .map(line => line.trim())
                        .filter(line => line !== "");
        for (let i = 0; i < links.length; i++) {
            await delay(500);
            const link = links[i];
            window.open(link, '_blank');
        }
        for (let i = 0; i < links.length; i++) {
            await delay(500);
            const link = links[i];
            window.open(link, '_blank');
        }
    }
});