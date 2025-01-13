document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const searchBookForm = document.getElementById('searchBook');
  
    const STORAGE_KEY = "BOOKSHELF_APPS";
    let books = [];
  
    // Periksa apakah Local Storage tersedia
    const isStorageAvailable = () => typeof Storage !== "undefined";
  
    // Simpan data ke Local Storage
    const saveBooksToStorage = () => {
        if (isStorageAvailable()) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        }
    };
  
    // Muat data dari Local Storage
    const loadBooksFromStorage = () => {
        if (isStorageAvailable()) {
            const serializedBooks = localStorage.getItem(STORAGE_KEY);
            if (serializedBooks) {
                books = JSON.parse(serializedBooks).map(book => ({
                    ...book,
                    year: Number(book.year) // Pastikan properti year bertipe number
                }));
            }
        }
    };
  
    // Generate unique ID untuk buku
    const generateBookId = () => Date.now().toString();
  
    // Tambah buku baru
    const addBook = (title, author, year, isComplete) => {
        const numericYear = parseInt(year, 10); // Konversi year menjadi number
        if (isNaN(numericYear) || numericYear <= 0) {
            alert("Tahun harus berupa angka positif!");
            return;
        }
  
        const bookId = generateBookId();
        const book = { id: bookId, title, author, year: numericYear, isComplete };
        books.push(book);
        saveBooksToStorage();
        renderBooks();
    };
  
    // Hapus buku berdasarkan ID
    const removeBook = (id) => {
        books = books.filter(book => book.id !== id);
        saveBooksToStorage();
        renderBooks();
    };
  
    // Ubah status selesai/tidak selesai
    const toggleBookCompletion = (id) => {
        const book = books.find(book => book.id === id);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooksToStorage();
            renderBooks();
        }
    };
  
    // Render buku ke daftar
    const renderBooks = () => {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';
  
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.dataset.bookid = book.id;
            bookItem.dataset.testid = 'bookItem';
            bookItem.classList.add('book-item');
  
            bookItem.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">
                        ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
                    </button>
                    <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                </div>
            `;
  
            const completeButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
            completeButton.addEventListener('click', () => toggleBookCompletion(book.id));
  
            const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');
            deleteButton.addEventListener('click', () => removeBook(book.id));
  
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
    };
  
    // Tambah buku baru dari form
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const title = document.getElementById('bookFormTitle').value.trim();
        const author = document.getElementById('bookFormAuthor').value.trim();
        const year = document.getElementById('bookFormYear').value.trim();
        const isComplete = document.getElementById('bookFormIsComplete').checked;
  
        if (title && author && year) {
            addBook(title, author, year, isComplete);
            bookForm.reset();
        } else {
            alert("Semua bidang harus diisi dengan benar!");
        }
    });
  
    // Cari buku berdasarkan judul
    searchBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase().trim();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
  
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';
  
        filteredBooks.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.dataset.bookid = book.id;
            bookItem.dataset.testid = 'bookItem';
  
            bookItem.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">
                        ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
                    </button>
                    <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                </div>
            `;
  
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
    });
  
    // Inisialisasi aplikasi
    loadBooksFromStorage();
    renderBooks();
});
