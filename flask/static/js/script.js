document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-button').addEventListener('click', searchCourse);
});


function searchCourse() {
    const courseCode = document.getElementById('course-code').value.trim().toUpperCase();
    const treeContainer = document.getElementById('prerequisite-tree');
    const loadingIndicator = document.getElementById('loading');
    
    treeContainer.innerHTML = '';
    loadingIndicator.style.display = 'block';

    try {
        setTimeout(() => {    
            if (coursePrereqs[courseCode]) {
                treeContainer.className = 'tree';
                buildTree(treeContainer, courseCode, 0);
            } else {
                treeContainer.innerHTML = '<p>Course not found.</p>';
            }
            loadingIndicator.style.display = 'none';
        }, 500);
    } catch (error) {
        console.error('Error:', error);
        loadingIndicator.style.display = 'none';
        treeContainer.innerHTML = '<p>An error occurred while building the tree.</p>';
    }
}

// function buildTree(parent, courseCode, setIndex) {
//     const node = document.createElement('div');
//     node.className = 'node';
    
//     // Create a separate label div for the course code
//     const label = document.createElement('div');
//     // const userCourse = ["MATA31H3"];
//     label.className = 'course-label';
//     label.textContent = courseCode;
    
//     node.appendChild(label);
    
//     if (coursePrereqs.hasOwnProperty(courseCode)) {
//         const prerequisites = coursePrereqs[courseCode];
//         console.log(prerequisites);
//         if (prerequisites.length > 1) {
//             node.classList.add('blue');
//             node.dataset.courseCode = courseCode;
//             node.dataset.setIndex = setIndex;
            
//             // Add set counter
//             const counter = document.createElement('span');
//             counter.className = 'set-counter';
//             counter.textContent = `${setIndex + 1}/${prerequisites.length}`;
//             node.appendChild(counter);
            
//             node.addEventListener('click', (event) => {
//                 // Check if click is on the node but not on any of its child nodes (except label and counter)
//                 const isChildNode = Array.from(node.querySelectorAll('.node')).some(child => 
//                     child.contains(event.target) && child !== node
//                 );
//                 if (!isChildNode) {
//                     switchPrereqSet(node, courseCode, parseInt(node.dataset.setIndex));
//                 }
//             });
//         } else if (prerequisites.length === 1) {
//             node.classList.add('yellow');
//         }
        
//         if (prerequisites.length > 0) {
//             const childrenContainer = document.createElement('div');
//             childrenContainer.className = 'children';
//             prerequisites[setIndex].forEach(prereq => {
//                 buildTree(childrenContainer, prereq, 0);
//             });
//             node.appendChild(childrenContainer);
//         }
//     } else {
//         node.classList.add('black');
//     }
    
//     parent.appendChild(node);
// }

function buildTree(parent, courseCode, setIndex) {
    const node = document.createElement('div');
    node.className = 'node';
    
    // Create a separate label div for the course code
    const label = document.createElement('div');
    label.className = 'course-label';
    label.textContent = courseCode;
    
    node.appendChild(label);
    
    // Check if user has already taken this course
    if (userCourses.includes(courseCode)) {
        // Make the node green and don't expand further
        node.classList.add('green');
        parent.appendChild(node);
        return; // Stop expanding from this node
    }
    
    if (coursePrereqs.hasOwnProperty(courseCode)) {
        const prerequisites = coursePrereqs[courseCode];
        console.log(prerequisites);
        if (prerequisites.length > 1) {
            node.classList.add('blue');
            node.dataset.courseCode = courseCode;
            node.dataset.setIndex = setIndex;
            
            // Add set counter
            const counter = document.createElement('span');
            counter.className = 'set-counter';
            counter.textContent = `${setIndex + 1}/${prerequisites.length}`;
            node.appendChild(counter);
            
            node.addEventListener('click', (event) => {
                // Check if click is on the node but not on any of its child nodes (except label and counter)
                const isChildNode = Array.from(node.querySelectorAll('.node')).some(child => 
                    child.contains(event.target) && child !== node
                );
                if (!isChildNode) {
                    switchPrereqSet(node, courseCode, parseInt(node.dataset.setIndex));
                }
            });
        } else if (prerequisites.length === 1) {
            node.classList.add('yellow');
        }
        
        if (prerequisites.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children';
            prerequisites[setIndex].forEach(prereq => {
                buildTree(childrenContainer, prereq, 0);
            });
            node.appendChild(childrenContainer);
        }
    } else {
        node.classList.add('black');
    }
    
    parent.appendChild(node);
}

function switchPrereqSet(node, courseCode, currentSetIndex) {
    const prerequisites = coursePrereqs[courseCode];
    const nextSetIndex = (currentSetIndex + 1) % prerequisites.length;
    
    const existingChildren = node.querySelector('.children');
    if (existingChildren) {
        node.removeChild(existingChildren);
    }

    // Update set counter
    const counter = node.querySelector('.set-counter');
    counter.textContent = `${nextSetIndex + 1}/${prerequisites.length}`;

    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'children';
    prerequisites[nextSetIndex].forEach(prereq => {
        buildTree(childrenContainer, prereq, 0);
    });
    node.appendChild(childrenContainer);

    node.dataset.setIndex = nextSetIndex;
}

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

            suggestionItem.addEventListener('click', function () {
                document.getElementById('course-code').value = courseCode;
                document.getElementById("search-button").click();
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});
document.addEventListener('click', function(event) {
    
    const suggestionsContainer = document.getElementById('suggestions-container');
    const inputField = document.getElementById('course-code');
    
    if (!inputField.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});
