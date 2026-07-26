document.getElementById('program-search-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const programInput = document.getElementById('program-input').value.trim();
    const programUrlElement = document.getElementById('program-url');

    
    if (programData[programInput]) {
        programUrlElement.innerHTML = `
            <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">
                ${programInput}
            </div>
            Program URL: <a href="${programData[programInput]}" target="_blank">${programData[programInput]}</a>
        `;
        programUrlElement.style.color = 'green';
    } else {
        programUrlElement.textContent = 'Program not found. Please check the name and try again.';
        programUrlElement.style.color = 'red';
    }
});

document.getElementById('program').addEventListener('input', function (event) {
    const programInput = event.target.value.trim().toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions-container');

    suggestionsContainer.innerHTML = '';

    if (programInput === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const inputTokens = programInput.split(/\s+/).filter(Boolean);

    const matchingPrograms = Object.keys(programData).filter(programName => {
        const programTokens = programName.toLowerCase().split(/\s+/);
        return inputTokens.every(inputToken =>
            programTokens.some(programToken => programToken.startsWith(inputToken))
        );
    });

    if (matchingPrograms.length === 0) {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';

        matchingPrograms.forEach(programName => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
        
            const highlightedText = programName.split(/\s+/).map(word => {
                const lowerWord = word.toLowerCase();
                const match = inputTokens.some(inputToken => lowerWord.startsWith(inputToken));
                return match ? `<span style="font-weight: bold; color: blue;">${word}</span>` : word;
            }).join(' ');
        
            suggestionItem.innerHTML = highlightedText;
        
            suggestionItem.addEventListener('click', function () {
                document.getElementById('program-input').value = programName;
                suggestionsContainer.style.display = 'none';
                document.getElementById('program-url').textContent = 'Searching...';
                searchProgram(programName);
            });
        
            suggestionsContainer.appendChild(suggestionItem);
        });        
    }
});

function searchProgram(programName) {
    const programUrlElement = document.getElementById('program-url');

    programUrlElement.innerHTML = `
        <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">
            ${programName}
        </div>
        Program URL: <a href="${programData[programName]}" target="_blank">${programData[programName]}</a>
    `;
    programUrlElement.style.color = 'green';
}

document.addEventListener('click', function(event) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    const inputField = document.getElementById('program-input');
    
    if (!inputField.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});