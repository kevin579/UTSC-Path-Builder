document.getElementById('course-code').addEventListener('input', function(event) {
    const courseInput = event.target.value.trim().toUpperCase();
    const suggestionsContainer = document.getElementById('suggestions-container');
    
    suggestionsContainer.innerHTML = '';

    if (courseInput === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const regex = new RegExp(courseInput.split('').join('.*'), 'i');

    const matchingCourses = Object.keys(courseData).filter(courseCode => {
        return regex.test(courseCode);
    });

    if (matchingCourses.length === 0) {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';

        matchingCourses.forEach(courseCode => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');

            let highlightedText = courseCode;
            const matchRegex = new RegExp(`(${courseInput.split('').join('|')})`, 'gi');

            highlightedText = highlightedText.replace(matchRegex, '<span style="font-weight: bold; color: blue;">$1</span>');

            suggestionItem.innerHTML = highlightedText;

            // Click event to fill input and hide suggestions
            suggestionItem.addEventListener('click', function () {
                document.getElementById('course-code').value = courseCode;
                suggestionsContainer.style.display = 'none'; // Hide the suggestion box after selection
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});

// Click outside to hide suggestions
document.addEventListener('click', function(event) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    const inputField = document.getElementById('course-code');
    
    if (!inputField.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});
