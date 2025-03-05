document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmark-form');
    const bookmarkList = document.getElementById('bookmark-list');

    // Load bookmarks from local storage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    function displayBookmarks() {
        bookmarkList.innerHTML = '';
        bookmarks.forEach((bookmark, index) => {
            const bookmarkElement = document.createElement('div');
            bookmarkElement.classList.add('bookmark');
            bookmarkElement.innerHTML = `
                <span class="bookmark-title">${bookmark.title}</span>
                <a href="${bookmark.url}" class="bookmark-url" target="_blank">${bookmark.url}</a>
                <span class="bookmark-category">${bookmark.category}</span>
                <button onclick="deleteBookmark(${index})">Delete</button>
            `;
            bookmarkList.appendChild(bookmarkElement);
        });
    }

    window.deleteBookmark = function(index) {
        bookmarks.splice(index, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const url = document.getElementById('url').value;
        const category = document.getElementById('category').value;
        const bookmark = { title, url, category };
        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
        form.reset();
    });

    displayBookmarks();
});