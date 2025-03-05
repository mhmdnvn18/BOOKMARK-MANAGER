document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmark-form');
    const editForm = document.getElementById('edit-bookmark-form');
    const bookmarkList = document.getElementById('bookmark-list');
    let editIndex = null;

    // Load bookmarks from local storage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    function displayBookmarks() {
        bookmarkList.innerHTML = '';
        const categories = {};

        bookmarks.forEach((bookmark, index) => {
            if (!categories[bookmark.category]) {
                categories[bookmark.category] = [];
            }
            categories[bookmark.category].push({ ...bookmark, index });
        });

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        for (const category in categories) {
            const categorySection = document.createElement('div');
            categorySection.classList.add('category-section');
            categorySection.innerHTML = `<h3 class="category-title">${category}</h3>`;

            categories[category].forEach(bookmark => {
                const bookmarkElement = document.createElement('div');
                bookmarkElement.classList.add('bookmark-card');
                bookmarkElement.innerHTML = `
                    <img src="https://www.google.com/s2/favicons?domain=${bookmark.url}" class="bookmark-preview" alt="Website Preview">
                    <div class="bookmark-details">
                        <span class="bookmark-title">${bookmark.title}</span>
                        <a href="${bookmark.url}" class="bookmark-url" target="_blank">${bookmark.url}</a>
                        <span class="bookmark-category">${bookmark.category}</span>
                    </div>
                    <div>
                        <button class="edit" onclick="editBookmark(${bookmark.index})">Edit</button>
                        <button onclick="deleteBookmark(${bookmark.index})">Delete</button>
                    </div>
                `;
                categorySection.appendChild(bookmarkElement);
            });

            categoryContainer.appendChild(categorySection);
        }

        bookmarkList.appendChild(categoryContainer);
    }

    window.deleteBookmark = function(index) {
        bookmarks.splice(index, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
    }

    window.editBookmark = function(index) {
        editIndex = index;
        const bookmark = bookmarks[index];
        document.getElementById('edit-title').value = bookmark.title;
        document.getElementById('edit-url').value = bookmark.url;
        document.getElementById('edit-category').value = bookmark.category;
        document.getElementById('edit-bookmark').style.display = 'block';
    }

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('edit-title').value;
        const url = document.getElementById('edit-url').value;
        const category = document.getElementById('edit-category').value;
        bookmarks[editIndex] = { title, url, category };
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
        editForm.reset();
        document.getElementById('edit-bookmark').style.display = 'none';
    });

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