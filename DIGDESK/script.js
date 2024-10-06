document.addEventListener('DOMContentLoaded', function() {
    // Hard-coded credentials
    const teacherCredentials = {
        'teacher1@example.com': 'password123',
        'teacher2@example.com': 'password456'
    };

    const studentCredentials = [
        { username: "johndoe", password: "student123" },
        { username: "janesmith", password: "student456" }
    ];

    const parentCredentials = {
        'parent1@example.com': 'parentpass1',
        'parent2@example.com': 'parentpass2'
    };

    // Update the existing login form event listener
    document.querySelectorAll('.auth-form, .login-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formId = this.id;
            const userType = formId.split('-')[0];
            
            if (userType === 'teacher') {
                const email = this.querySelector('input[type="text"]').value;
                const password = this.querySelector('input[type="password"]').value;
                
                if (teacherCredentials[email] === password) {
                    login('teacher');
                } else {
                    alert('Invalid teacher credentials. Please try again.');
                }
            } else if (userType === 'student') {
                const username = document.getElementById('student-username').value;
                const password = document.getElementById('student-password').value;
                
                const student = studentCredentials.find(s => s.username.toLowerCase() === username.toLowerCase() && s.password === password);
                
                if (student) {
                    login('student');
                } else {
                    alert('Invalid student credentials. Please try again.');
                }
            } else if (userType === 'parent') {
                const email = this.querySelector('input[type="text"]').value;
                const password = this.querySelector('input[type="password"]').value;
                
                if (parentCredentials[email] === password) {
                    login('parent');
                } else {
                    alert('Invalid parent credentials. Please try again.');
                }
            }
        });
    });

    function login(userType) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the appropriate user page
        const userPage = document.getElementById(`${userType}-page`);
        if (userPage) {
            userPage.classList.add('active');
        } else {
            console.error(`User page not found for ${userType}`);
        }
        
        // If it's the teacher, also show the navigation page
        if (userType === 'teacher') {
            const teacherNavigation = document.getElementById('teacher-navigation');
            if (teacherNavigation) {
                teacherNavigation.classList.add('active');
            }
        }
        
        // If it's the teacher, show the design thinking navigation page
        if (userType === 'teacher') {
            const teacherDesignThinking = document.getElementById('teacher-design-thinking');
            if (teacherDesignThinking) {
                teacherDesignThinking.classList.add('active');
            }
        }
        
        addLogoutButton();
    }

    function addLogoutButton() {
        const header = document.querySelector('header');
        let logoutButton = document.querySelector('.logout-button');
        
        if (!logoutButton) {
            logoutButton = document.createElement('button');
            logoutButton.textContent = 'Logout';
            logoutButton.classList.add('logout-button');
            logoutButton.addEventListener('click', logout);
            header.appendChild(logoutButton);
        }
    }

    function logout() {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the home page
        document.getElementById('home').classList.add('active');
        
        // Remove the logout button
        const logoutButton = document.querySelector('.logout-button');
        if (logoutButton) {
            logoutButton.remove();
        }
    }

    // Add this code to handle subject selection and navigation
    document.querySelectorAll('.subject-btn').forEach(button => {
        button.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            const selectedSubject = document.getElementById('selected-subject');
            if (selectedSubject) {
                selectedSubject.textContent = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Dashboard`;
            }
            const subjectDashboard = document.getElementById('subject-dashboard');
            if (subjectDashboard) {
                subjectDashboard.style.display = 'block';
            }
        });
    });

    const goToDashboardButton = document.getElementById('go-to-dashboard');
    if (goToDashboardButton) {
        goToDashboardButton.addEventListener('click', function() {
            const teacherPage = document.getElementById('teacher-page');
            const teacherNavigation = document.getElementById('teacher-navigation');
            if (teacherPage) teacherPage.classList.add('active');
            if (teacherNavigation) teacherNavigation.classList.remove('active');
        });
    }

    // Add this function to handle tab switching for teacher login
    // document.querySelectorAll('.auth-tab').forEach(tab => {
    //     tab.addEventListener('click', function() {
    //         const formId = this.getAttribute('data-form');
    //         const card = this.closest('.login-card');
            
    //         // Deactivate all tabs and forms in this card
    //         card.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    //         card.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
    //         // Activate the clicked tab and its corresponding form
    //         this.classList.add('active');
    //         const form = card.querySelector(`#${formId}`);
    //         if (form) form.classList.add('active');
    //     });
    // });

    // Add this code to handle design thinking assessment navigation
    const designThinkingNav = document.querySelector('#teacher-design-thinking .dashboard-nav');
    if (designThinkingNav) {
        designThinkingNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const sectionId = e.target.getAttribute('data-section');
                
                // Remove active class from all links and sections
                designThinkingNav.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                document.querySelectorAll('#teacher-design-thinking .dashboard-section').forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked link and corresponding section
                e.target.classList.add('active');
                document.getElementById(sectionId).classList.add('active');
            }
        });
    }

    // Array to store created questions
    let designThinkingQuestions = [];

    // Handle design thinking assessment form submission
    const designThinkingForm = document.getElementById('design-thinking-assessment-form');
    if (designThinkingForm) {
        designThinkingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('assessment-title').value;
            const description = document.getElementById('assessment-description').value;
            const questionType = document.getElementById('question-type').value;
            const questionText = document.getElementById('question-text').value;

            // Create the question object
            const question = createDesignThinkingQuestion(title, description, questionType, questionText);

            // Add the question to the array
            designThinkingQuestions.push(question);

            // Display the created questions
            displayCreatedQuestions();

            // Clear the form
            this.reset();

            // Show a success message
            alert('Question added successfully!');
        });
    }

    function createDesignThinkingQuestion(title, description, type, text) {
        const question = {
            title: title,
            description: description,
            type: type,
            text: text,
            options: [],
            correctAnswer: null
        };

        if (type === 'multiple-choice') {
            // For simplicity, we'll add 4 options for multiple-choice questions
            for (let i = 1; i <= 4; i++) {
                const option = prompt(`Enter option ${i}:`);
                question.options.push(option);
            }
            const correctIndex = prompt('Enter the number of the correct option (1-4):');
            question.correctAnswer = question.options[correctIndex - 1];
        } else if (type === 'short-answer' || type === 'long-answer') {
            question.correctAnswer = prompt('Enter a sample correct answer:');
        }

        return question;
    }

    function displayCreatedQuestions() {
        const questionList = document.getElementById('question-list') || createQuestionList();
        questionList.innerHTML = '';

        designThinkingQuestions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question-item');
            questionElement.innerHTML = `
                <h4>Question ${index + 1}: ${question.title}</h4>
                <p><strong>Type:</strong> ${question.type}</p>
                <p><strong>Description:</strong> ${question.description}</p>
                <p><strong>Question:</strong> ${question.text}</p>
                ${question.type === 'multiple-choice' ? 
                    `<p><strong>Options:</strong></p>
                    <ul>${question.options.map(option => `<li>${option}</li>`).join('')}</ul>
                    <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>` :
                    `<p><strong>Sample Answer:</strong> ${question.correctAnswer}</p>`
                }
            `;
            questionList.appendChild(questionElement);
        });
    }

    function createQuestionList() {
        const questionList = document.createElement('div');
        questionList.id = 'question-list';
        const createAssessmentSection = document.getElementById('create-assessment');
        if (createAssessmentSection) {
            createAssessmentSection.appendChild(questionList);
        }
        return questionList;
    }

    // Add navigation to the design thinking page
    const createAssessmentButton = document.getElementById('create-assessment');
    if (createAssessmentButton) {
        createAssessmentButton.addEventListener('click', function() {
            document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
            const designThinkingPage = document.getElementById('teacher-design-thinking');
            if (designThinkingPage) {
                designThinkingPage.classList.add('active');
            }
        });
    }

    // Design Thinking MCQ Quiz
    const designThinkingQuiz = [
        {
            question: "What is the first stage of the design thinking process?",
            options: ["Ideate", "Empathize", "Define", "Prototype"],
            correctAnswer: 1
        },
        {
            question: "Which stage involves brainstorming and generating creative ideas?",
            options: ["Test", "Prototype", "Ideate", "Define"],
            correctAnswer: 2
        },
        {
            question: "What is the primary goal of the 'Empathize' stage?",
            options: ["To create solutions", "To understand the user's needs and perspectives", "To test prototypes", "To define the problem"],
            correctAnswer: 1
        },
        {
            question: "In which stage do you create a tangible representation of your ideas?",
            options: ["Define", "Ideate", "Test", "Prototype"],
            correctAnswer: 3
        },
        {
            question: "What is the purpose of the 'Test' stage in design thinking?",
            options: ["To generate new ideas", "To empathize with users", "To gather feedback and refine solutions", "To define the problem statement"],
            correctAnswer: 2
        }
    ];

    let currentQuestionIndex = 0;
    let userAnswers = [];

    function displayQuizQuestion(index) {
        const quizContainer = document.getElementById('quiz-container');
        const question = designThinkingQuiz[index];
        
        quizContainer.innerHTML = `
            <h4>Question ${index + 1} of ${designThinkingQuiz.length}</h4>
            <p>${question.question}</p>
            ${question.options.map((option, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${i}">
                    ${option}
                </label><br>
            `).join('')}
        `;

        document.getElementById('submit-quiz').style.display = 'block';
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        userAnswers = [];
        displayQuizQuestion(currentQuestionIndex);
    }

    document.getElementById('submit-quiz').addEventListener('click', function() {
        const selectedAnswer = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        if (selectedAnswer) {
            userAnswers[currentQuestionIndex] = parseInt(selectedAnswer.value);
            currentQuestionIndex++;
            if (currentQuestionIndex < designThinkingQuiz.length) {
                displayQuizQuestion(currentQuestionIndex);
            } else {
                showQuizResults();
            }
        } else {
            alert('Please select an answer before proceeding.');
        }
    });

    function showQuizResults() {
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('quiz-results');
        const scoreDisplay = document.getElementById('score-display');
        const feedbackContainer = document.getElementById('question-feedback');

        quizContainer.style.display = 'none';
        document.getElementById('submit-quiz').style.display = 'none';
        resultsContainer.style.display = 'block';

        let score = 0;
        let feedback = '';

        designThinkingQuiz.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                score++;
            }
            feedback += `
                <p>
                    <strong>Question ${index + 1}:</strong> ${question.question}<br>
                    Your answer: ${question.options[userAnswers[index]]}<br>
                    Correct answer: ${question.options[question.correctAnswer]}<br>
                    ${userAnswers[index] === question.correctAnswer ? 
                        '<span style="color: green;">Correct!</span>' : 
                        '<span style="color: red;">Incorrect</span>'}
                </p>
            `;
        });

        scoreDisplay.textContent = `Your score: ${score} out of ${designThinkingQuiz.length}`;
        feedbackContainer.innerHTML = feedback;
    }

    // Add this to your existing designThinkingNav event listener
    if (designThinkingNav) {
        designThinkingNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const sectionId = e.target.getAttribute('data-section');
                
                // ... (keep existing code)

                if (sectionId === 'mcq-quiz') {
                    startQuiz();
                }
            }
        });
    }

    // ... (keep the rest of the existing code)
});