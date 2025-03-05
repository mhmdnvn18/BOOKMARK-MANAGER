document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmark-form');
    const editForm = document.getElementById('edit-bookmark-form');
    const bookmarkList = document.getElementById('bookmark-list');
    let editIndex = null;

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    function displayBookmarks() {
        bookmarkList.innerHTML = '';
        db.collection('bookmarks').get().then((querySnapshot) => {
            const categories = {};
            querySnapshot.forEach((doc) => {
                const bookmark = doc.data();
                if (!categories[bookmark.category]) {
                    categories[bookmark.category] = [];
                }
                categories[bookmark.category].push({ ...bookmark, id: doc.id });
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
                        <img src="https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}" class="bookmark-preview" alt="Website Preview">
                        <div class="bookmark-details">
                            <span class="bookmark-title">${bookmark.title}</span>
                            <a href="${bookmark.url}" class="bookmark-url" target="_blank">${bookmark.url}</a>
                            <span class="bookmark-category">${bookmark.category}</span>
                        </div>
                        <div>
                            <button class="edit" onclick="editBookmark('${bookmark.id}')">Edit</button>
                            <button onclick="deleteBookmark('${bookmark.id}')">Delete</button>
                        </div>
                    `;
                    categorySection.appendChild(bookmarkElement);
                });

                categoryContainer.appendChild(categorySection);
            }

            bookmarkList.appendChild(categoryContainer);
        });
    }

    window.deleteBookmark = function(id) {
        db.collection('bookmarks').doc(id).delete().then(() => {
            window.location.reload();
        });
    }

    window.editBookmark = function(id) {
        editIndex = id;
        db.collection('bookmarks').doc(id).get().then((doc) => {
            const bookmark = doc.data();
            document.getElementById('edit-title').value = bookmark.title;
            document.getElementById('edit-url').value = bookmark.url;
            document.getElementById('edit-category').value = bookmark.category;
            document.getElementById('edit-bookmark').style.display = 'block';
        });
    }

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('edit-title').value;
        const url = document.getElementById('edit-url').value;
        const category = document.getElementById('edit-category').value;
        db.collection('bookmarks').doc(editIndex).update({ title, url, category }).then(() => {
            displayBookmarks();
            editForm.reset();
            document.getElementById('edit-bookmark').style.display = 'none';
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const url = document.getElementById('url').value;
        const category = document.getElementById('category').value;
        db.collection('bookmarks').add({ title, url, category }).then(() => {
            displayBookmarks();
            form.reset();
        });
    });

    window.logout = function() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    }

    displayBookmarks();
});