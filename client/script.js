const submitButton = document.getElementById('submit');
const userInputElement = document.getElementById('userInput');
const loader = document.querySelector('.loader');
const messageField = document.querySelector('.field');

// Event listener toevoegen aan de submit button
submitButton.addEventListener('click', getMessage);

let disabledButtton = false

async function getMessage() {

    // call gestuurd doe dan niks
    if (disabledButtton) {
        return;
    }

    const userInput = userInputElement.value;

    // validatie controleren of het veld leeg is
    if (!userInput) {
        alert('Please enter a message')
        return;
    }

    // loading spinner laten zien
    loader.style.display = 'block';
    loader.style.display = 'center';

// fetch request
    const options = {
        method: 'POST',
        body: JSON.stringify({
            query: userInput
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // status true 'het is bezig'
    disabledButtton = true;

    try {
        const response = await fetch('http://localhost:8000/chat', options);
        const aiResponse = await response.json();

        console.log(userInput);
        console.log(aiResponse);

        // loading spinner verbergen
        loader.style.display = 'none';

        // ai response en userInput tonen
        addMessageToField(userInput, 'user')
        addMessageToField(aiResponse.response, 'bot')

    } catch (error) {
        console.error(error);
        // Als er een fout optreedt, verberg dan ook de spinner
        loader.style.display = 'none';
    } finally {
        disabledButtton = false;
    }
}


function addMessageToField(message, sender) {
    const showMessage = document.createElement('li');

    showMessage.textContent = message;
    showMessage.classList.add(sender)
    messageField.appendChild(showMessage)
}