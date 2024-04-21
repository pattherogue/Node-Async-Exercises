document.addEventListener('DOMContentLoaded', async () => {
    const drawCardBtn = document.getElementById('draw-card-btn');
    const resetDeckBtn = document.getElementById('reset-deck-btn');
    const cardsDiv = document.getElementById('cards');

    let deckId;

    drawCardBtn.addEventListener('click', async () => {
        try {
            if (!deckId) {
                deckId = await createDeck();
            }
            const cardData = await drawCard(deckId);
            displayCard(cardData);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    resetDeckBtn.addEventListener('click', () => {
        resetDeck();
    });

    async function createDeck() {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        return data.deck_id;
    }

    async function drawCard(deckId) {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        return data.cards[0];
    }

    function displayCard(cardData) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <span class="card-value">${cardData.value}</span>
            <span class="card-suit">${cardData.suit}</span>
        `;
        cardsDiv.appendChild(cardDiv);
    }

    function resetDeck() {
        deckId = undefined;
        cardsDiv.innerHTML = '';
    }
});
