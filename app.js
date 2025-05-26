// Global expenses array
let expenses = [];
let expenseChartInstance = null; // To hold the chart instance

// DOM Element References
const descriptionInput = document.getElementById('expense-description');
const amountInput = document.getElementById('expense-amount');
const addButton = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');
// Chart canvas will be referenced later if needed for chart-specific functions

// Function to save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to display expenses in the UI
function displayExpenses() {
    // Clear the current content of the expense list
    expenseList.innerHTML = '';

    // Iterate through the expenses array
    expenses.forEach(expense => {
        // Create an <li> element
        const listItem = document.createElement('li');
        // Set its text content
        listItem.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;
        // Append the <li> to the expense list
        expenseList.appendChild(listItem);
    });
}

// Function to add a new expense
function addExpense() {
    const description = descriptionInput.value.trim();
    const amountValue = amountInput.value.trim(); // Get as string first for validation
    const amount = parseFloat(amountValue);

    // Validation
    if (description === '') {
        alert('Description cannot be empty.');
        return;
    }
    if (amountValue === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive amount.');
        return;
    }

    // Create an expense object
    const newExpense = {
        id: Date.now(), // Unique ID using timestamp
        description: description,
        amount: amount
    };

    // Add the new expense object to the expenses array
    expenses.push(newExpense);

    // Call displayExpenses() to update the UI
    displayExpenses();

    // Call saveExpenses() to persist data
    saveExpenses();

    // Clear the input fields
    descriptionInput.value = '';
    amountInput.value = '';
}

// Function to load expenses from localStorage
function loadExpenses() {
    const savedExpenses = localStorage.getItem('expenses');

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }

    // Call displayExpenses() to show them on the page
    displayExpenses();
    renderOrUpdateChart(); // Render chart with loaded data
}

// Function to render or update the chart
function renderOrUpdateChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    // Aggregate expenses by description
    const aggregatedExpenses = {};
    expenses.forEach(expense => {
        if (aggregatedExpenses[expense.description]) {
            aggregatedExpenses[expense.description] += expense.amount;
        } else {
            aggregatedExpenses[expense.description] = expense.amount;
        }
    });
    const labels = Object.keys(aggregatedExpenses);
    const data = Object.values(aggregatedExpenses);

    const config = {
        type: 'bar', // Using bar chart as per example
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses by Category',
                data: data,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true, // Ensure legend is shown
                    position: 'top',
                },
                tooltip: {
                    enabled: true, // Ensure tooltips are shown
                }
            }
        }
    };

    if (expenseChartInstance) {
        expenseChartInstance.destroy();
    }
    expenseChartInstance = new Chart(ctx, config);
}

// Event Listeners
// Attach event listener to the "add expense" button
if (addButton) { // Ensure button exists before adding listener
    addButton.addEventListener('click', addExpense);
}

// Attach event listener to the DOMContentLoaded event on the window
window.addEventListener('DOMContentLoaded', loadExpenses);
