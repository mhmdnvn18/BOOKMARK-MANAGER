document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmark-form');
    const editForm = document.getElementById('edit-bookmark-form');
    const bookmarkList = document.getElementById('bookmark-list');
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

    async function displayBookmarks() {
        bookmarkList.innerHTML = '';
        const querySnapshot = await db.collection('bookmarks').get();
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
    }

    window.deleteBookmark = async function(id) {
        await db.collection('bookmarks').doc(id).delete();
        displayBookmarks();
    }

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

    displayBookmarks();
});