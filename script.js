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
        await addDoc(collection(db, 'bookmarks'), { title, url, category });
        displayBookmarks();
        form.reset();
    });

    window.logout = function() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    }

    displayBookmarks();
});