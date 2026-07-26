const courses = Object.keys(courseData);

document.getElementById('courseSearch').addEventListener('input', function(event) {
    const courseInput = event.target.value.trim().toUpperCase();
    const suggestionsContainer = document.getElementById('suggestions-container');
    
    suggestionsContainer.innerHTML = '';

    if (courseInput === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const regex = new RegExp(courseInput.split('').join('.*'), 'i');

    const matchingCourses = courses.filter(courseCode => {
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

            suggestionItem.addEventListener('click', function () {
                document.getElementById('courseSearch').value = courseCode;
                suggestionsContainer.style.display = 'none';
                showFeedbackForm(courseCode);
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});

document.addEventListener('click', function(event) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    const inputField = document.getElementById('courseSearch');
    
    if (!inputField.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});

function showFeedbackForm(courseCode) {
    const feedbackForm = document.getElementById('feedbackForm');
    const selectedCourseSpan = document.getElementById('selectedCourse');

    selectedCourseSpan.textContent = courseCode;
    feedbackForm.style.display = 'block';
}

function submitFeedback() {
    let selectedCourse = document.getElementById('courseSearch').value;
    let feedback = {
        course: selectedCourse,
        conceptual: parseInt(document.getElementById('conceptual').value),
        analytical: parseInt(document.getElementById('analytical').value),
        individual: parseInt(document.getElementById('individual').value),
        rigid: parseInt(document.getElementById('rigid').value),
        quantitative: parseInt(document.getElementById('quantitative').value)
    };

    fetch('https://ucqasdyusfebtohttrct.supabase.co/rest/v1/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWFzZHl1c2ZlYnRvaHR0cmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3Njk5MDUsImV4cCI6MjA1NDM0NTkwNX0.auN5mnO4aIeH4UMlkqlu6hSTLFBAJtrT74Zmk7sAmvU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWFzZHl1c2ZlYnRvaHR0cmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3Njk5MDUsImV4cCI6MjA1NDM0NTkwNX0.auN5mnO4aIeH4UMlkqlu6hSTLFBAJtrT74Zmk7sAmvU',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(feedback)
    })
    .then(response => {
        console.log('Response Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Response Data:', data);
        alert('Feedback submitted successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting feedback.');
    });
}

function updateSlider(attribute) {
    let slider = document.getElementById(attribute);
    let leftValueDisplay = document.getElementById(attribute + 'Value');
    let rightValueDisplay = document.getElementById(attribute === 'conceptual' ? 'practicalValue' :
                                                     attribute === 'analytical' ? 'creativeValue' :
                                                     attribute === 'individual' ? 'collaborativeValue' :
                                                     attribute === 'rigid' ? 'flexibleValue' :
                                                     'qualitativeValue');

    leftValueDisplay.textContent = (100 - slider.value) + '%';
    rightValueDisplay.textContent = slider.value + '%';
}