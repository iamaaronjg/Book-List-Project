// ES5 version - constructors and prototype methods

// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor - we aren't passing anything in, just an empty function
function UI() {}

// Add book to list
UI.prototype.addBookToList = function(book) {
    const list = document.getElementById('book-list');

    // Create tr element
    const row = document.createElement('tr');
    // Insert columns
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;

    // Append our new row with book details to the list
    list.appendChild(row);
}

// Show alert
UI.prototype.showAlert = function(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add class name
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent container - this container wraps around our entire user interface
    const container = document.querySelector('.container');

    // Get book form - we will use this to place an alert before it
    const form = document.querySelector('#book-form');

    // Insert alert
    container.insertBefore(div, form);

    // timeout after 3 seconds
    setTimeout(function() {
        document.querySelector('.alert').remove();
    }, 3000);
}

// Delete book
UI.prototype.deleteBook = function(target) {
    if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
    }
}

// Verify book removal
UI.prototype.verifyBookRemoval = function(originalNumberOfBooks, newNumberOfBooks) {
    if (newNumberOfBooks < originalNumberOfBooks) {
        return true;
    } else {
        return false;
    }
}

// Clear fields
UI.prototype.clearFields = function() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

// Event listener for adding a book
document.getElementById('book-form').addEventListener('submit', function(e) {

    // Get form values submitted by user
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;
    
    // Instantiate book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    if (title === '' || author === '' || isbn === '') {
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to list
        ui.addBookToList(book);

        // Show alert for successful book submission
        ui.showAlert('Book added!', 'success');

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event listener for deleting books from our list (using event delegation as the Xs only exist once a user has first made an input)
document.getElementById('book-list').addEventListener('click', function(e) {
    // Count number of books currently in our book list - will be used to check if items have been removed
    const originalNumberOfBooks = document.getElementById('book-list').rows.length;

    // Instantiate UI
    const ui = new UI();

    // Delete book
    ui.deleteBook(e.target);
    
    // Count books again
    const newNumberOfBooks = document.getElementById('book-list').rows.length;
    
    console.log(newNumberOfBooks);

    // Verify book has been deleted before displaying success message
    if (ui.verifyBookRemoval(originalNumberOfBooks, newNumberOfBooks)) {
        ui.showAlert('Book removed!', 'success');
    }

    e.preventDefault();
});