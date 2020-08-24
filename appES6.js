class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
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

    showAlert(message, className) {
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

    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    verifyBookDeletion(originalNumberOfBooks, newNumberOfBooks) {
        if (newNumberOfBooks < originalNumberOfBooks) {
            return true;
        } else {
            return false;
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;

        // Check to see if local storage already has books
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        // Obtain current list list of books (checking if empty already implemented in getBooks() method)
        const books = Store.getBooks();

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

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

        // Add to local storage
        Store.addBook(book);

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

    numberOfBooks = Store.getBooks().length;

    // Remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
    // Count books again
    const newNumberOfBooks = document.getElementById('book-list').rows.length;
    
    console.log(newNumberOfBooks);

    // Verify book has been deleted before displaying success message
    if (ui.verifyBookDeletion(originalNumberOfBooks, newNumberOfBooks)) {
        ui.showAlert('Book removed!', 'success');
    }
    
    e.preventDefault();
});
