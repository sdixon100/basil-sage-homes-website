document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInputContainer = document.getElementById('chat-input-container');

    let currentStep = 0;
    const userData = {
        foundHome: null,
        name: '',
        location: '',
        wantsTour: null
    };

    const steps = [
        {
            question: "Hi there! Have you found a home yet?",
            type: 'buttons',
            options: ['Yes', 'No'],
            field: 'foundHome'
        },
        {
            question: "Got it! May I ask what is your name?",
            type: 'input',
            placeholder: 'Your name',
            field: 'name'
        },
        {
            question: "Thanks! What is your email address?",
            type: 'input',
            placeholder: 'email@example.com',
            field: 'email'
        },
        {
            question: "And what is your phone number?",
            type: 'input',
            placeholder: '(843) 555-0123',
            field: 'phone'
        },
        {
            question: "Great to meet you! What location are you searching in?",
            type: 'input',
            placeholder: 'e.g. Ladson, Charleston...',
            field: 'location'
        },
        {
            question: "Would you like to take a self-guided tour of the property in person?",
            type: 'buttons',
            options: ['Yes', 'No'],
            field: 'wantsTour'
        }
    ];

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden') && currentStep === 0 && chatMessages.children.length === 0) {
            renderStep();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function renderStep() {
        if (currentStep >= steps.length) {
            addMessage("Thank you! Your information has been saved. We'll be in touch soon.", 'assistant');
            chatInputContainer.innerHTML = '';
            submitData();
            return;
        }

        const step = steps[currentStep];
        addMessage(step.question, 'assistant');
        chatInputContainer.innerHTML = '';

        if (step.type === 'buttons') {
            const group = document.createElement('div');
            group.classList.add('chat-btn-group');
            step.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.classList.add('chat-btn');
                btn.textContent = opt;
                btn.onclick = () => handleInput(opt);
                group.appendChild(btn);
            });
            chatInputContainer.appendChild(group);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('chat-input');
            input.placeholder = step.placeholder;
            input.onkeypress = (e) => {
                if (e.key === 'Enter') handleInput(input.value);
            };

            const submitBtn = document.createElement('button');
            submitBtn.classList.add('chat-submit-btn');
            submitBtn.textContent = 'Send';
            submitBtn.onclick = () => handleInput(input.value);

            chatInputContainer.appendChild(input);
            chatInputContainer.appendChild(submitBtn);
            input.focus();
        }
    }

    function handleInput(value) {
        if (!value || value.trim() === '') return;

        const step = steps[currentStep];
        userData[step.field] = value;
        addMessage(value, 'user');

        currentStep++;
        setTimeout(renderStep, 500);
    }

    function resetChat() {
        currentStep = 0;
        userData.foundHome = null;
        userData.name = '';
        userData.email = '';
        userData.phone = '';
        userData.location = '';
        userData.wantsTour = null;
        chatMessages.innerHTML = '';
        chatInputContainer.innerHTML = '';
        // Small delay before showing the first question again if the window is still open
        if (!chatWindow.classList.contains('hidden')) {
            setTimeout(renderStep, 1000);
        }
    }

    async function submitData() {
        console.log('Submitting user data:', userData);
        try {
            const response = await fetch('http://localhost:3000/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                console.log('Data submitted successfully');
                // Automatically reset after 5 seconds of success message
                setTimeout(resetChat, 5000);
            } else {
                console.error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    }
});
