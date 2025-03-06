document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmark-form');
    const editForm = document.getElementById('edit-bookmark-form');
    const bookmarkList = document.getElementById('bookmarks-grid');
    const themeToggle = document.getElementById('theme-toggle');
    const categoriesContainer = document.getElementById('categories-container');
    const searchInput = document.getElementById('search-input');
    let editIndex = null;

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDSyI1drQSWkU1192Ol_7UnOztxxTZkerQ",
        authDomain: "bookmark-manager-7c5ab.firebaseapp.com",
        projectId: "bookmark-manager-7c5ab",
        storageBucket: "bookmark-manager-7c5ab.firebasestorage.app",
        messagingSenderId: "1098246411927",
        appId: "1:1098246411927:web:9a44915017f9d35fbefbd2",
        measurementId: "G-YF6CS3N1C6"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    const confirmationDialog = document.createElement('div');
    confirmationDialog.classList.add('confirmation-dialog');
    confirmationDialog.style.display = 'none';
    confirmationDialog.innerHTML = `
        <p>Are you sure you want to delete this bookmark?</p>
        <button id="confirm-delete">Yes</button>
        <button id="cancel-delete">No</button>
    `;
    document.body.appendChild(spinner);
    document.body.appendChild(confirmationDialog);

    async function displayBookmarks() {
        categoriesContainer.innerHTML = '';
        spinner.style.display = 'block';
        try {
            const querySnapshot = await db.collection('bookmarks').get();
            const categories = {};
            querySnapshot.forEach((doc) => {
                const bookmark = doc.data();
                if (!categories[bookmark.category]) {
                    categories[bookmark.category] = [];
                }
                categories[bookmark.category].push({ ...bookmark, id: doc.id });
            });

            for (const category in categories) {
                const categorySection = document.createElement('div');
                categorySection.classList.add('category-section');
                categorySection.innerHTML = `<h3 class="category-title">${category}</h3>`;

                const bookmarkList = document.createElement('div');
                bookmarkList.classList.add('bookmark-list');

                categories[category].forEach(bookmark => {
                    const bookmarkElement = document.createElement('div');
                    bookmarkElement.classList.add('bookmark-card');
                    bookmarkElement.innerHTML = `
                        <div class="category-chip">${bookmark.category}</div>
                        <div class="mb-3">
                            <i class="fab fa-${bookmark.icon} fa-2x text-primary"></i>
                        </div>
                        <h3 class="h5 mb-2">
                            <img src="https://www.google.com/s2/favicons?domain=${bookmark.url}" class="favicon" alt="Favicon">
                            ${bookmark.title}
                        </h3>
                        <p class="text-muted mb-3">${bookmark.description}</p>
                        <a href="${bookmark.url}" class="btn btn-sm btn-outline-primary" target="_blank">
                            Visit Site <i class="fas fa-external-link-alt ms-2"></i>
                        </a>
                        <p class="card-text">
                            <span class="bookmark-category">${bookmark.category}</span>
                            <div class="bookmark-actions">
                                <button class="btn btn-sm btn-light me-2" onclick="editBookmark('${bookmark.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-light" onclick="deleteBookmark('${bookmark.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </p>
                    `;
                    bookmarkList.appendChild(bookmarkElement);
                });

                categorySection.appendChild(bookmarkList);
                categoriesContainer.appendChild(categorySection);
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            spinner.style.display = 'none';
        }
    }

    window.deleteBookmark = function(id) {
        confirmationDialog.style.display = 'block';
        document.getElementById('confirm-delete').onclick = async function() {
            try {
                await db.collection('bookmarks').doc(id).delete();
                displayBookmarks();
            } catch (error) {
                console.error('Error deleting bookmark:', error);
            } finally {
                confirmationDialog.style.display = 'none';
            }
        };
        document.getElementById('cancel-delete').onclick = function() {
            confirmationDialog.style.display = 'none';
        };
    };

    window.editBookmark = async function(id) {
        editIndex = id;
        const docSnap = await db.collection('bookmarks').doc(id).get();
        const bookmark = docSnap.data();
        document.getElementById('edit-title').value = bookmark.title;
        document.getElementById('edit-url').value = bookmark.url;
        document.getElementById('edit-category').value = bookmark.category;
        document.getElementById('edit-bookmark').style.display = 'block';
    }

    editForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const title = document.getElementById('edit-title').value;
        const url = document.getElementById('edit-url').value;
        const category = document.getElementById('edit-category').value;
        await db.collection('bookmarks').doc(editIndex).update({ title, url, category });
        displayBookmarks();
        editForm.reset();
        document.getElementById('edit-bookmark').style.display = 'none';
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const url = document.getElementById('url').value;
        const category = document.getElementById('category').value;
        console.log('Adding bookmark:', { title, url, category });
        try {
            await db.collection('bookmarks').add({ title, url, category });
            console.log('Bookmark added successfully');
            displayBookmarks();
            form.reset();
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    });

    window.logout = function() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.querySelectorAll('.card').forEach(card => {
            card.classList.toggle('dark-mode');
        });
        document.querySelectorAll('.category-section').forEach(section => {
            section.classList.toggle('dark-mode');
        });
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('dark-mode');
        });
        document.querySelectorAll('.category-section').forEach(section => {
            section.classList.add('dark-mode');
        });
    }

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        filterBookmarks(query);
    });

    function filterBookmarks(query) {
        const bookmarks = document.querySelectorAll('.bookmark-card');
        bookmarks.forEach(bookmark => {
            const title = bookmark.querySelector('.h5').textContent.toLowerCase();
            const url = bookmark.querySelector('a').href.toLowerCase();
            if (title.includes(query) || url.includes(query)) {
                bookmark.style.display = '';
            } else {
                bookmark.style.display = 'none';
            }
        });
    }

    displayBookmarks();
});