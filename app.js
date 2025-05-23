let expenses = [];

function addExpense() {
    const descriptionInput = document.getElementById('expense-description');
    const amountInput = document.getElementById('expense-amount');
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (description === '') {
        alert('Description cannot be empty.');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    const expense = {
        description: description,
        amount: amount
    };

    expenses.push(expense);

    descriptionInput.value = '';
    amountInput.value = '';

    displayExpenses();
    saveExpenses();
}

function displayExpenses() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear existing items

    expenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;
        expenseList.appendChild(listItem);
    });
}

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpenses() {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
    displayExpenses(); // Always call displayExpenses, even if no saved expenses
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadExpenses);
const addButton = document.getElementById('add-expense');
addButton.addEventListener('click', addExpense);
