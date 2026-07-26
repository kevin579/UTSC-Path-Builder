var courseInput = "";

document.getElementById('course-search-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    courseInput = document.getElementById('course-input').value.trim().toUpperCase();
    const courseDetailsContainer = document.getElementById('course-details-container');
    const text = document.getElementById('text-message');
    const feedbackContainer = document.getElementById("feedback-container");

    if (courseData[courseInput]) {
        document.getElementById('search-result').textContent = '';

        const courseDetails = courseData[courseInput];

        courseDetailsContainer.innerHTML = `
            <h3>Course Details for ${courseInput}</h3>
            <table>
                <tr>
                    <th>Drop Rate</th>
                    <td>${courseDetails[0].toFixed(2)} %</td>
                </tr>
                <tr>
                    <th>Overall Review (out of 5)</th>
                    <td>${courseDetails[1].toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Recommendation Rate (out of 5)</th>
                    <td>${courseDetails[2].toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Workload (out of 5)</th>
                    <td>${courseDetails[3].toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Quality (out of 5)</th>
                    <td>${courseDetails[4].toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Difficulty (out of 5)</th>
                    <td>${courseDetails[5].toFixed(2)}</td>
                </tr>
            </table>
        `;
        courseDetailsContainer.style.display = 'block';

        // Show feedback form only if user has taken the course
        if (userCourses.includes(courseInput)) {
            text.innerHTML = `
                <p>You had taken this course before, would you like to rate it?</p>
            `;
            feedbackContainer.style.display = "block";
        } else {
            text.innerHTML = `
                <p>You had not taken this course yet, login or update your profile to rate it yourself.</p>
            `;
            feedbackContainer.style.display = "none";
        }

    } else {
        courseDetailsContainer.style.display = 'none';
        feedbackContainer.style.display = "none";  // Hide feedback form if course not found
        document.getElementById('search-result').textContent = 'Course not found. Please check the course code and try again.';
        document.getElementById('search-result').style.color = 'red';
    }
});


document.getElementById('course-feedback-selector').addEventListener('submit', async function(event) {
    event.preventDefault();


        const review = parseFloat(document.getElementById("review").value);
        const recommend = parseFloat(document.getElementById("recommend").value);
        const workload = parseFloat(document.getElementById("workload").value);
        const quality = parseFloat(document.getElementById("quality").value);
        const difficulty = parseFloat(document.getElementById("difficulty").value);

        let newValues = [0, review, recommend, workload, quality, difficulty];

        try {
            const response = await fetch('http://127.0.0.1:5000/api/update_course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    course_code: courseInput,
                    new_values: newValues
                })
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                alert("Course ratings updated successfully!");
            } else {
                alert("Error updating course: " + result.error);
            }
        } catch (error) {
            console.error("Error sending data to server:", error);
        }
});



document.getElementById('course-input').addEventListener('input', function(event) {
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

            suggestionItem.addEventListener('click', function () {
                document.getElementById('course-input').value = courseCode;
                suggestionsContainer.style.display = 'none';
                document.getElementById('course-search-form').dispatchEvent(new Event('submit'));
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});

document.addEventListener('click', function(event) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    const inputField = document.getElementById('course-input');
    
    if (!inputField.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});
