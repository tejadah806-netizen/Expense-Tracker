// Get page elements
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategorySelect = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');
const totalAmountSpan = document.getElementById('total-amount');

let expenses = [];
let chart; // holds the Chart.js instance

// Load saved expenses when page starts
window.addEventListener('load', () => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = savedExpenses;
    renderExpenses();
    updateTotal();
    updateChart();
});

// Add expense when form is submitted
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value;

    if (!name || !amount || !category) {
        alert("Please fill in all fields.");
        return;
    }

    const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category
    };

    expenses.push(newExpense);
    saveExpenses();
    renderExpenses();
    updateTotal();
    updateChart();

    // Clear the form
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseCategorySelect.value = '';
});

// Save to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Display all expenses
function renderExpenses() {
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.classList.add('expense-item');
        li.innerHTML = `
            <span>${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})</span>
            <button class="delete-btn" data-id="${expense.id}">X</button>
        `;
        expenseList.appendChild(li);
    });
}

// Calculate total
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountSpan.textContent = total.toFixed(2);
}

// Delete expense
expenseList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = Number(event.target.getAttribute('data-id'));
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        renderExpenses();
        updateTotal();
        updateChart();
    }
});

// Chart.js: Update the spending pie chart
function updateChart() {
    const categories = {};

    // Sum by category
    expenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    const ctx = document.getElementById('expense-chart').getContext('2d');

    // Destroy old chart before creating a new one
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#6C63FF', '#00C49F', '#FFBB28', '#FF8042', '#4A90E2'
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

