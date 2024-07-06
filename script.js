// Function to add an expense to the table and store it in localStorage
function addExpense() {
    var expenseName = document.getElementById('expense').value;
    var description = document.getElementById('description').value;
    var amount = document.getElementById('amount').value;
    var paymentMethod = document.getElementById('paymentMethod').value;
    var date = document.getElementById('date').value;
    var table = document.getElementById('expenseBody');
    var newRow = table.insertRow();
    newRow.innerHTML = '<td class="py-2 px-4">' + expenseName + '</td><td class="py-2 px-4">' + description + '</td><td class="py-2 px-4">PKR ' + amount + '</td><td class="py-2 px-4">' + paymentMethod + '</td><td class="py-2 px-4">' + date + '</td><td class="py-2 px-4"><button onclick="editExpense(this)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Edit</button> <button onclick="deleteExpense(this)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Delete</button></td>';
    
    // Store expense data in localStorage
    var expenseData = {
        expenseName: expenseName,
        description: description,
        amount: amount,
        paymentMethod: paymentMethod,
        date: date
    };

    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expenseData);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update total amount
    updateTotalAmount();
}

// Function to load expense data from localStorage
function loadExpenses() {
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    var table = document.getElementById('expenseBody');
    expenses.forEach(function(expense) {
        var newRow = table.insertRow();
        newRow.innerHTML = '<td class="py-2 px-4">' + expense.expenseName + '</td><td class="py-2 px-4">' + expense.description + '</td><td class="py-2 px-4">PKR ' + expense.amount + '</td><td class="py-2 px-4">' + expense.paymentMethod + '</td><td class="py-2 px-4">' + expense.date + '</td><td class="py-2 px-4"><button onclick="editExpense(this)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Edit</button> <button onclick="deleteExpense(this)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Delete</button></td>';
    });

    // Update total amount
    updateTotalAmount();
}

// Function to update total amount
function updateTotalAmount() {
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    var totalAmount = expenses.reduce(function(total, expense) {
        return total + parseFloat(expense.amount);
    }, 0);
    document.getElementById('totalAmount').innerText = 'Total Amount: PKR ' + totalAmount.toFixed(2);
}

// Load expense data when the page loads
window.onload = function() {
    loadExpenses();
};

// Function to handle form submission
document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addExpense();
    document.getElementById('expenseForm').reset();
});

// Function to delete a single expense
function deleteExpense(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateLocalStorage();
}

// Function to delete all expenses
function deleteAllExpenses() {
    var table = document.getElementById('expenseBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    localStorage.removeItem('expenses');

    // Update total amount
    updateTotalAmount();
}

// Function to update localStorage after deleting an expense
function updateLocalStorage() {
    var table = document.getElementById('expenseBody');
    var expenses = [];
    for (var i = 0; i < table.rows.length; i++) {
        var expense = {
            expenseName: table.rows[i].cells[0].innerText,
            description: table.rows[i].cells[1].innerText,
            amount: table.rows[i].cells[2].innerText.replace('PKR ', ''), // Remove the "PKR " prefix
            paymentMethod: table.rows[i].cells[3].innerText,
            date: table.rows[i].cells[4].innerText
        };
        expenses.push(expense);
    }
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update total amount
    updateTotalAmount();
}

// Function to download data as PDF or HTML
function downloadData(format) {
    var table = document.getElementById('expenseTable');
    if (format === 'pdf') {
        var element = document.getElementById('expenseTable');
        html2pdf()
            .from(element)
            .save('expenses.pdf');
    } else if (format === 'html') {
        var htmlContent = '<html><head><title>Expense Tracker HTML View</title></head><body>' + table.outerHTML + '</body></html>';
        var filename = "expenses.html";
        var blob = new Blob([htmlContent], {type: 'text/html'});
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Function to edit an existing expense
function editExpense(button) {
    var row = button.parentNode.parentNode;
    var expenseName = row.cells[0].innerText;
    var description = row.cells[1].innerText;
    var amount = row.cells[2].innerText.replace('PKR ', '');
    var paymentMethod = row.cells[3].innerText;
    var date = row.cells[4].innerText;

    document.getElementById('expense').value = expenseName;
    document.getElementById('description').value = description;
    document.getElementById('amount').value = amount;
    document.getElementById('paymentMethod').value = paymentMethod;
    document.getElementById('date').value = date;

    deleteExpense(button); // Remove the existing row
}

// Function to filter displayed expenses based on payment method
function filterExpenses(paymentMethod) {
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    var filteredExpenses = expenses.filter(function(expense) {
        return paymentMethod === "" || expense.paymentMethod === paymentMethod;
    });

    // Clear the table
    var table = document.getElementById('expenseBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    // Add filtered expenses to the table
    filteredExpenses.forEach(function(expense) {
        var newRow = table.insertRow();
        newRow.innerHTML = '<td class="py-2 px-4">' + expense.expenseName + '</td><td class="py-2 px-4">' + expense.description + '</td><td class="py-2 px-4">PKR ' + expense.amount + '</td><td class="py-2 px-4">' + expense.paymentMethod + '</td><td class="py-2 px-4">' + expense.date + '</td><td class="py-2 px-4"><button onclick="editExpense(this)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Edit</button> <button onclick="deleteExpense(this)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Delete</button></td>';
    });

    // Update total amount for filtered expenses
    var totalAmount = filteredExpenses.reduce(function(total, expense) {
        return total + parseFloat(expense.amount);
    }, 0);
    document.getElementById('totalAmount').innerText = 'Total Amount: PKR ' + totalAmount.toFixed(2);
}

// Function to sort expenses based on criteria (amount or date)
function sortExpenses(criteria) {
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (criteria === 'amount') {
        expenses.sort(function(a, b) {
            return parseFloat(a.amount) - parseFloat(b.amount);
        });
    } else if (criteria === 'date') {
        expenses.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });
    }

    // Clear the table
    var table = document.getElementById('expenseBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    // Add sorted expenses to the table
    expenses.forEach(function(expense) {
        var newRow = table.insertRow();
        newRow.innerHTML = '<td class="py-2 px-4">' + expense.expenseName + '</td><td class="py-2 px-4">' + expense.description + '</td><td class="py-2 px-4">PKR ' + expense.amount + '</td><td class="py-2 px-4">' + expense.paymentMethod + '</td><td class="py-2 px-4">' + expense.date + '</td><td class="py-2 px-4"><button onclick="editExpense(this)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Edit</button> <button onclick="deleteExpense(this)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded cursor-pointer">Delete</button></td>';
    });

    // Update total amount
    var totalAmount = expenses.reduce(function(total, expense) {
        return total + parseFloat(expense.amount);
    }, 0);
    document.getElementById('totalAmount').innerText = 'Total Amount: PKR ' + totalAmount.toFixed(2);
}

// Function to show the invoice modal
function showInvoiceModal() {
    document.getElementById('invoiceModal').classList.remove('hidden');
}

// Function to close the invoice modal
function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.add('hidden');
}

// Function to generate the invoice
function generateInvoice() {
    var invoiceDate = document.getElementById('invoiceDate').value;
    var customerName = document.getElementById('customerName').value;
    var customerAddress = document.getElementById('customerAddress').value;

    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    var tableRows = expenses.map(function(expense) {
        return `<tr><td>${expense.expenseName}</td><td>${expense.description}</td><td>PKR ${expense.amount}</td><td>${expense.paymentMethod}</td><td>${expense.date}</td></tr>`;
    }).join('');

    var invoiceHtml = `
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; color: #555; }
                .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
                .invoice-box table td { padding: 5px; vertical-align: top; }
                .invoice-box table tr td:nth-child(2) { text-align: right; }
                .invoice-box table tr.top table td { padding-bottom: 20px; }
                .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #333; }
                .invoice-box table tr.information table td { padding-bottom: 40px; }
                .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
                .invoice-box table tr.details td { padding-bottom: 20px; }
                .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
                .invoice-box table tr.item.last td { border-bottom: none; }
                .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <table cellpadding="0" cellspacing="0">
                    <tr class="top">
                        <td colspan="2">
                            <table>
                                <tr>
                                    <td class="title">
                                        <h2>Invoice</h2>
                                    </td>
                                    <td>
                                        Invoice Date: ${invoiceDate}<br>
                                        Customer Name: ${customerName}<br>
                                        Customer Address: ${customerAddress}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="heading">
                        <td>Expense</td>
                        <td>Description</td>
                        <td>Amount</td>
                        <td>Payment Method</td>
                        <td>Date</td>
                    </tr>
                    ${tableRows}
                </table>
            </div>
        </body>
        </html>
    `;

    var invoiceElement = document.createElement('div');
    invoiceElement.innerHTML = invoiceHtml;
    document.body.appendChild(invoiceElement);
    html2pdf().from(invoiceElement).save('invoice.pdf').then(function() {
        document.body.removeChild(invoiceElement);
    });

    closeInvoiceModal();
}

  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById('darkModeToggle');
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  darkModeToggle.addEventListener('click', () => {
      if (prefersDarkScheme.matches) {
          document.body.classList.toggle('light-mode');
      } else {
          document.body.classList.toggle('dark-mode');
      }
      
      let theme;
      if (document.body.classList.contains('dark')) {
          theme = 'dark';
      } else {
          theme = 'light';
      }
      localStorage.setItem('theme', theme);
  });

  window.addEventListener('load', () => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme == 'dark') {
          document.body.classList.add('dark');
      }
  });