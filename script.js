document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmark-form');
    const editForm = document.getElementById('edit-bookmark-form');
    const bookmarkList = document.getElementById('bookmark-list');
    const themeToggle = document.getElementById('theme-toggle');
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
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

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
        bookmarkList.innerHTML = '';
        const querySnapshot = await getDocs(collection(db, 'bookmarks'));
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
            categorySection.innerHTML = `<h3 class="category-title">${category} (${categories[category].length})</h3>`;

            categories[category].forEach(bookmark => {
                const bookmarkElement = document.createElement('div');
                bookmarkElement.classList.add('card', 'text-bg-primary', 'mb-3');
                bookmarkElement.style.maxWidth = '18rem';
                bookmarkElement.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">
                            <img src="https://www.google.com/s2/favicons?domain=${bookmark.url}" class="favicon" alt="Favicon">
                            ${bookmark.title}
                        </h5>
                        <p class="card-text">
                            <a href="${bookmark.url}" class="bookmark-url" target="_blank">${bookmark.url}</a>
                        </p>
                        <p class="card-text">
                            <span class="bookmark-category">${bookmark.category}</span>
                            <div class="bookmark-actions">
                                <button class="edit btn btn-warning" onclick="editBookmark('${bookmark.id}')">Edit</button>
                                <button class="btn btn-danger" onclick="deleteBookmark('${bookmark.id}')">Delete</button>
                            </div>
                        </p>
                    </div>
                `;
                if (document.body.classList.contains('dark-mode')) {
                    bookmarkElement.classList.add('dark-mode');
                }
                categorySection.appendChild(bookmarkElement);
            });

            categoryContainer.appendChild(categorySection);
        }

        bookmarkList.appendChild(categoryContainer);
    }

    window.deleteBookmark = async function(id) {
        await deleteDoc(doc(db, 'bookmarks', id));
        displayBookmarks();
    }

    window.editBookmark = async function(id) {
        editIndex = id;
        const docSnap = await getDoc(doc(db, 'bookmarks', id));
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
        await updateDoc(doc(db, 'bookmarks', editIndex), { title, url, category });
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
            await addDoc(collection(db, 'bookmarks'), { title, url, category });
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
        document.querySelectorAll('section').forEach(section => {
            section.classList.toggle('dark-mode');
        });
        document.querySelectorAll('.card').forEach(card => {
            card.classList.toggle('dark-mode');
        });
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('dark-mode');
        });
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('dark-mode');
        });
    }

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        filterBookmarks(query);
    });

    function filterBookmarks(query) {
        const bookmarks = document.querySelectorAll('.card');
        bookmarks.forEach(bookmark => {
            const title = bookmark.querySelector('.card-title').textContent.toLowerCase();
            const url = bookmark.querySelector('.bookmark-url').textContent.toLowerCase();
            if (title.includes(query) || url.includes(query)) {
                bookmark.style.display = '';
            } else {
                bookmark.style.display = 'none';
            }
        });
    }

    displayBookmarks();
});