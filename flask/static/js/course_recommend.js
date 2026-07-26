document.addEventListener('DOMContentLoaded', function() {
    // Get references to all form elements
    const form = document.getElementById('course-priority-selector');
    const qualitySlider = document.getElementById('quality');
    const difficultySlider = document.getElementById('difficulty');
    const workloadSlider = document.getElementById('workload');
    const relativitySlider = document.getElementById('relativity');
    const toleranceSlider = document.getElementById('tolerance');
    const programInput = document.getElementById('program');

    // load program nature & course nature data
    let programNatureData = {};
    let courseNatureData = {};

    async function loadNatureData() {
        try {
            // load program nature data
            const programResponse = await fetch('static/data/program_nature_test.json');
            if (!programResponse.ok) throw new Error('Failed to load program nature data');
            programNatureData = await programResponse.json();

            // load course nature data
            const courseResponse = await fetch('static/data/course_nature_results.json');
            if (!courseResponse.ok) throw new Error('Failed to load course nature data');
            courseNatureData = await courseResponse.json();

            console.log('Nature data loaded successfully');
        } catch (error) {
            console.error('Error loading nature data:', error);
        }
    }

    loadNatureData();

    function handleSubmit(event) {
        event.preventDefault();
        console.log('Form submitted');
        
        // Add console.log to debug slider values
        const quality = parseFloat(qualitySlider.value);
        const difficulty = parseFloat(difficultySlider.value);
        const workload = parseFloat(workloadSlider.value);
        const relativityThreshold = parseFloat(relativitySlider.value);
        const userProgram = programInput.value.trim();

        console.log('Slider values:', { quality, difficulty, workload, relativityThreshold });
        console.log('User program:', userProgram);

        // Check if courseData is defined
        if (typeof courseData === 'undefined') {
            console.error('courseData is not defined');
            return;
        }
        
        console.log('courseData available:', courseData);

        const results = filterCourses(courseData, quality, difficulty, workload, relativityThreshold, userProgram);
        console.log('Filter results:', results);
        displayResults(results);
    }

    function filterCourses(courseData, qualityThreshold, difficultyThreshold, workloadThreshold, relativityThreshold, userProgram) {
        console.log('Filtering with thresholds:', {
            qualityThreshold,
            difficultyThreshold,
            workloadThreshold,
            relativityThreshold
        });
        
        const tolerance = toleranceSlider.value/10;
        
        const result = {
            matches: {},
            filteredCount: 0,
            totalCourses: Object.keys(courseData).length
        };

        // get nature of user's program
        const programNature = programNatureData[userProgram];
        console.log('Program nature for', userProgram, ':', programNature);
    
        for (const [courseName, values] of Object.entries(courseData)) {
            console.log(`Processing course ${courseName}:`, values);
            
            const courseQuality = parseFloat(values[4]);
            const courseDifficulty = parseFloat(values[5]);
            const courseWorkload = parseFloat(values[3]);
            
            console.log('Course values:', {
                courseQuality,
                courseDifficulty,
                courseWorkload
            });
            
            const qualityMatch = courseQuality + tolerance > qualityThreshold;
            const difficultyMatch = Math.abs(courseDifficulty - difficultyThreshold) <= tolerance;
            const workloadMatch = Math.abs(courseWorkload - workloadThreshold) <= tolerance;
            
            console.log('Matches:', {
                qualityMatch,
                difficultyMatch,
                workloadMatch
            });
    
            // calculate relativity score only if user has entered a program
            let relativityScore = 0;
            if (userProgram && programNature) {
                // find course nature object in array
                const courseNature = courseNatureData.find(course => course.code === courseName);
                console.log('Course nature for', courseName, ':', courseNature);
    
                if (courseNature) {
                    const attributes = ['Conceptual', 'Analytical', 'Individual', 'Rigid', 'Quantitative'];
                    let totalDifference = 0;
                    attributes.forEach(attr => {
                        totalDifference += Math.abs(programNature[attr] - courseNature[attr]);
                    });
                    relativityScore = (100 - (totalDifference / attributes.length)) / 20; // normalize to 0-5
    
                    // round relativity score to nearest int so it matches slider values
                    relativityScore = Math.round(relativityScore);
                }
            }
    
            console.log('Relativity score (rounded):', relativityScore);
    
            // check if course matches thresholds
            const relativityMatch = !userProgram || relativityScore >= relativityThreshold;
    
            if (qualityMatch && difficultyMatch && workloadMatch && relativityMatch) {
                result.matches[courseName] = {
                    dropRate: values[0],
                    overallReview: values[1],
                    recommendation: values[2],
                    workload: courseWorkload,
                    quality: courseQuality,
                    difficulty: courseDifficulty,
                    relativityScore: relativityScore,
                    matchScore: Math.abs(courseQuality - qualityThreshold) + 
                               Math.abs(courseDifficulty - difficultyThreshold) + 
                               Math.abs(courseWorkload - workloadThreshold)
                };
                result.filteredCount++;
            }
        }
        
        result.matches = Object.fromEntries(
            Object.entries(result.matches).sort((a, b) => a[1].matchScore - b[1].matchScore)
        );
        
        return result;
    }

    function displayResults(filterResults) {
        console.log('Displaying results:', filterResults);
        
        let resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'results-container';
            form.after(resultsContainer);
        }
        
        resultsContainer.innerHTML = '';
        
        const resultsHTML = `
            <div class="results-summary">
                <h3>Found ${filterResults.filteredCount} matches out of ${filterResults.totalCourses} courses</h3>
            </div>
            <div class="results-list">
                ${Object.entries(filterResults.matches).map(([course, data]) => `
                    <div class="course-card">
                        <h4>${course}</h4>
                        <ul>
                            <li>Drop Rate: ${data.dropRate}</li>
                            <li>Quality: ${data.quality.toFixed(1)}/5</li>
                            <li>Difficulty: ${data.difficulty.toFixed(1)}/5</li>
                            <li>Workload: ${data.workload.toFixed(1)}/5</li>
                            <li>Overall Review: ${data.overallReview}/5</li>
                            <li>Recommendation: ${data.recommendation}/5</li>
                            ${data.relativityScore !== undefined ? `<li>Relativity Score: ${data.relativityScore.toFixed(1)}/5</li>` : ''}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
    }

    form.addEventListener('submit', handleSubmit);
});


document.getElementById('program').addEventListener('input', function(event) {
    const courseInput = event.target.value.trim().toUpperCase();
    const suggestionsContainer = document.getElementById('suggestions-container');
    const programs = {
        "Computer Science":1,
        "Mathematics":1,
        "Physics":1,
        "Biology":1,
        "Chemistry":1,
        "Psychology":1,
        "Management":1,
        "History":1,
        "Sociology":1,
        "Environmental Science":1,
        "City Studies":1,
        "Philosophy":1,
        "Politics":1
    }
    suggestionsContainer.innerHTML = '';

    if (courseInput === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const regex = new RegExp(courseInput.split('').join('.*'), 'i');

    const matchingCourses = Object.keys(programs).filter(program => {
        return regex.test(program);
    });

    if (matchingCourses.length === 0) {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';

        matchingCourses.forEach(program => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');

            let highlightedText = program;
            const matchRegex = new RegExp(`(${courseInput.split('').join('|')})`, 'gi');

            highlightedText = highlightedText.replace(matchRegex, '<span style="font-weight: bold; color: blue;">$1</span>');

            suggestionItem.innerHTML = highlightedText;

            suggestionItem.addEventListener('click', function () {
                document.getElementById('program').value = program;
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});
document.addEventListener('click', function(event) {
    
    const suggestionsContainer = document.getElementById('suggestions-container');
    const inputField = document.getElementById('program');
    
    if (!inputField.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});