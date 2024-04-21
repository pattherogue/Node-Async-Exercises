document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', async () => {
        const favoriteNumber = document.getElementById('favorite-number').value;
        if (!favoriteNumber) {
            alert('Please enter a number.');
            return;
        }

        try {
            const favoriteNumberFact = await getNumberFact(favoriteNumber);
            displayFact(favoriteNumberFact);

            const numberFacts = await Promise.all([
                getNumberFact(42),
                getNumberFact(100),
                getNumberFact(2022)
            ]);
            displayFacts(numberFacts);

            const favoriteNumberFacts = await getUniqueNumberFacts(favoriteNumber);
            displayFacts(favoriteNumberFacts, true);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

async function getNumberFact(number) {
    try {
        const response = await fetch(`http://numbersapi.com/${number}?json`);
        const data = await response.json();
        return data.text;
    } catch (error) {
        throw error;
    }
}

async function getUniqueNumberFacts(number) {
    const uniqueFacts = new Set();
    try {
        while (uniqueFacts.size < 4) {
            const fact = await getNumberFact(number);
            uniqueFacts.add(fact);
        }
        return Array.from(uniqueFacts);
    } catch (error) {
        throw error;
    }
}

function displayFact(fact) {
    const numberFactsDiv = document.getElementById('number-facts');
    const factElement = document.createElement('p');
    factElement.textContent = fact;
    numberFactsDiv.appendChild(factElement);
}

function displayFacts(facts, clearPrevious = false) {
    const numberFactsDiv = document.getElementById('number-facts');
    if (clearPrevious) {
        numberFactsDiv.innerHTML = '';
    }
    facts.forEach(fact => {
        const factElement = document.createElement('p');
        factElement.textContent = fact;
        numberFactsDiv.appendChild(factElement);
    });
}
