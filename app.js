let expenses = [];
let expenseChartInstance = null;

function renderStatisticsChart(expensesData) {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    const labels = expensesData.map(exp => exp.description);
    const dataPoints = expensesData.map(exp => exp.amount);

    if (expenseChartInstance) {
        expenseChartInstance.destroy();
    }

    expenseChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expense Amount',
                data: dataPoints,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

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
    calculateAndDisplayStatistics();
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
    calculateAndDisplayStatistics();
}

function calculateAndDisplayStatistics() {
    const numberOfExpenses = expenses.length;
    let totalAmount = 0;
    expenses.forEach(expense => {
        totalAmount += expense.amount;
    });
    const averageAmount = numberOfExpenses === 0 ? 0 : totalAmount / numberOfExpenses;

    document.getElementById('total-expenses').textContent = numberOfExpenses;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    document.getElementById('average-amount').textContent = averageAmount.toFixed(2);
    renderStatisticsChart(expenses);
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadExpenses);
const addButton = document.getElementById('add-expense');
addButton.addEventListener('click', addExpense);
