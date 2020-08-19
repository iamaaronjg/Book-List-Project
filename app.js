// ES5 version - constructors and prototype methods

// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor - we aren't passing anything in, just an empty function
function UI() {}

// Event listeners
document.getElementById('book-form').addEventListener('submit', function(e) {

    // Get form values submitted by user
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;
    
    // Instantiate book
    const book = new Book(title, author, isbn);

    e.preventDefault();
});