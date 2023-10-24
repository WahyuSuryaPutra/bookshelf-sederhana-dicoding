document.addEventListener("DOMContentLoaded", function () {
    const bookTitle = document.getElementById("judulBuku");
    const bookAuthor = document.getElementById("pemilikbuku");
    const bookYear = document.getElementById("tahunbuku");
    const bookIsComplete = document.getElementById("selesaibacabuku");
    const form = document.getElementById("masukanBuku");
    const submitButton = document.getElementById("bukuSubmit");
    const bookShelf = document.querySelectorAll(".book_shelf");
    const inCompleteBooksContainer = document.getElementById("belomSelesai");
    const completeBooksContainer = document.getElementById("selesaiBuku");
    const search = document.getElementById("cariBuku");
    const searchInput = document.getElementById("searchBookTitle");
    let books = JSON.parse(localStorage.getItem("books")) || [];

    renderUI();

    function editSubmitButton(event) {
        switch (event.target.checked) {
            case true:
                submitButton.innerHTML = "Masukkan Buku ke rak <span>selesai dibaca</span>"
                break
            case false:
                submitButton.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>"
                break
        }
    }

    function renderUI() {
        let completeContainer = ``;
        let inCompleteContainer = ``;

        books.forEach((book) => {
            switch (book.isComplete) {
                case true:
                    (completeContainer += `
                    <article class="book_item">
                        <h3>${book.title}</h3>
                        <p>Penulis: ${book.author}</p>
                        <p>Tahun: ${book.year}</p>
                        <div class="action">
                            <button class="green" id="moveShelf" data-bookid="${book.id}">Belum selesai di Baca</button>
                            <button class="red" id="deleteButton" data-bookid="${book.id}">Hapus buku</button>
                        </div>
                    </article>
                    `);
                    break
                case false:
                    (inCompleteContainer += `
                    <article class="book_item">
                        <h3>${book.title}</h3>
                        <p>Penulis: ${book.author}</p>
                        <p>Tahun: ${book.year}</p>
                        <div class="action">
                            <button class="green" id="moveShelf" data-bookid="${book.id}">Sudah selesai di Baca</button>
                            <button class="red" id="deleteButton" data-bookid="${book.id}">Hapus buku</button>
                        </div>
                    </article>
                    `);
                    break
            }
        });

        inCompleteBooksContainer.innerHTML = inCompleteContainer;
        completeBooksContainer.innerHTML = completeContainer;
    }

    function addBook(book) {
        books.push(book);

        if (typeof Storage !== undefined) {
            localStorage.setItem("books", JSON.stringify(books));
        }

        renderUI();
    }

    function moveBook(book) {
        const bookId = parseInt(book.target.dataset.bookid);

        books.filter((book) => book.id === bookId).map((book) => (book.isComplete = !book.isComplete));

        if (typeof Storage !== undefined) {
            localStorage.setItem("books", JSON.stringify(books));
        }

        renderUI();
    }

    function deleteBook(book) {
        const bookId = parseInt(book.target.dataset.bookid);

        books = books.filter((book) => book.id !== bookId);
        if (typeof Storage !== undefined) {
            localStorage.setItem("books", JSON.stringify(books));
        }

        renderUI();
    }

    function filterBooks(keyword) {
        books = books.filter((book) => book.title.indexOf(keyword) !== -1);

        renderUI();
        books = JSON.parse(localStorage.getItem("books")) || [];
    }

    bookIsComplete.addEventListener("change", function (e) {
        editSubmitButton(e);
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const book = {
            id: +new Date(),
            title: bookTitle.value,
            author: bookAuthor.value,
            year: Number(bookYear.value),
            isComplete: bookIsComplete.checked,
        };

        bookTitle.value = "";
        bookAuthor.value = "";
        bookYear.value = 0;
        bookIsComplete.checked = false;

        addBook(book);
    });

    bookShelf.forEach((shelf) => {
        shelf.addEventListener("click", function (event) {
            switch (event.target.getAttribute("id")) {
                case "moveShelf":
                    moveBook(event)
                    break
                case "deleteButton":
                    deleteBook(event)
            }
        });
    });

    search.addEventListener("submit", function (e) {
        e.preventDefault();

        const keyword = searchInput.value;
        filterBooks(keyword);
    });
});
