import './style.css'

document.getElementById("Button").addEventListener("click", calculateResult);

function calculateResult() {
    const fruits = [["🍋", "🍌"], ["🍎", "🍏"], ["🍐", "🍑"]];
    document.getElementById("Result").innerText = fruits.flat()
}

