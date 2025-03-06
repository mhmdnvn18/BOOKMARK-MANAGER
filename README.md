# Bookmark Manager

This project is a simple Bookmark Manager application that allows users to add, edit, and delete bookmarks. It uses Firebase Firestore for data storage and authentication.

## Features

- Add new bookmarks with title, URL, category, description, and icon.
- Edit existing bookmarks.
- Delete bookmarks.
- Categorize bookmarks.
- Simple login system.
- Dark mode toggle.
- Responsive design using Bootstrap.

## Prerequisites

- Node.js and npm installed on your machine.
- Firebase account and project set up.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/BOOKMARK-MANAGER.git
cd BOOKMARK-MANAGER
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a Firebase project and obtain your Firebase configuration. Replace the configuration in `script.js` and `index.html` with your own Firebase configuration.

### 4. Firestore Rules

Update your Firestore rules to allow read and write operations:

```plaintext
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Run the Application

Open `index.html` in your browser to start the application.

## File Structure

```
BOOKMARK-MANAGER/
├── data.json
├── firestore.rules
├── index.html
├── login.html
├── login.js
├── script.js
├── styles.css
└── README.md
```

## Usage

### Adding a Bookmark

1. Fill in the title, URL, category, description, and icon in the "Add Bookmark" section.
2. Click "Add Bookmark" to save the bookmark.

### Editing a Bookmark

1. Click the "Edit" button next to the bookmark you want to edit.
2. Update the title, URL, category, description, and icon in the "Edit Bookmark" section.
3. Click "Save Changes" to update the bookmark.

### Deleting a Bookmark

1. Click the "Delete" button next to the bookmark you want to delete.

### Logging In

1. Open `login.html` in your browser.
2. Enter the username and password (default: `admin` / `password`).
3. Click "Login" to access the Bookmark Manager.

### Logging Out

1. Click the "Logout" button in the header to log out.

## License

This project is licensed under the MIT License.