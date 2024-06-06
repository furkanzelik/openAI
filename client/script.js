document.getElementById('submit').addEventListener('click', getMessage);
let disabledButtton = false

async function getMessage() {

    // call gestuurd doe dan niks
    if (disabledButtton) {
        return;
    }

    const userInput = document.getElementById('userInput').value;
    // validatie controleren of het veld leeg is
    if (!userInput){
        alert('Veld mag niet leeg blijven')
        return;
    }

    // loading spinner laten zien
    document.querySelector('.loader').style.display = 'block';

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
        document.querySelector('.loader').style.display = 'none';

        // ai response en userInput tonen
        addMessageToField(userInput, 'user')
        addMessageToField(aiResponse.response, 'bot')

    } catch (error) {
        console.error(error);
        // Als er een fout optreedt, verberg dan ook de spinner
        document.querySelector('.loader').style.display = 'none';
    } finally {
        disabledButtton = false;
    }
}


function addMessageToField(message,sender){
    const showMessage = document.createElement('li');

    showMessage.textContent = message;
    showMessage.classList.add(sender)

    const field = document.querySelector('.field')
    field.appendChild(showMessage)
}