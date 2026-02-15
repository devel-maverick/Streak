
(async () => {
    // Check if Monaco Editor is present
    const editor = document.querySelector('.monaco-editor');
    const editorPresent = !!editor;
    console.log(`Monaco Editor present: ${editorPresent}`);

    // Check buttons
    const analyzeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze'));
    const optimizeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Optimize'));

    console.log(`Analyze Button present: ${!!analyzeBtn}`);
    console.log(`Optimize Button present: ${!!optimizeBtn}`);

    // Check Chat Panel visibility (if open)
    const chatPanel = document.querySelector('.w-96');
    console.log(`Chat Panel present: ${!!chatPanel}`);

    return { editorPresent, analyzeBtn: !!analyzeBtn, optimizeBtn: !!optimizeBtn, chatPanel: !!chatPanel };
})();
