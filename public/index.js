let isLoggedIn = false;

// Show message to user
function showMessage(message, type = 'success') {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    
    setTimeout(() => {
        messagesDiv.removeChild(messageDiv);
    }, 3000);
}

// Login function
async function login() {
    const username = document.getElementById('username').value;
    
    if (!username) {
        showMessage('Please enter a username', 'error');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const data = await response.json();
        
        if (response.ok) {
            isLoggedIn = true;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('sessionInfo').style.display = 'block';
            document.getElementById('crudSection').style.display = 'block';
            document.getElementById('sessionDetails').textContent = `Welcome, ${username}!`;
            showMessage('Login successful!');
            loadUsers();
        } else {
            showMessage(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Login failed: ' + error.message, 'error');
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });

        const data = await response.json();
        
        if (response.ok) {
            isLoggedIn = false;
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('sessionInfo').style.display = 'none';
            document.getElementById('crudSection').style.display = 'none';
            document.getElementById('username').value = '';
            showMessage('Logout successful!');
        } else {
            showMessage(data.error || 'Logout failed', 'error');
        }
    } catch (error) {
        showMessage('Logout failed: ' + error.message, 'error');
    }
}

// Create user (CREATE operation)
async function createUser() {
    const name = document.getElementById('newName').value;
    const email = document.getElementById('newEmail').value;
    const age = document.getElementById('newAge').value;

    if (!name || !email || !age) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, age: parseInt(age) })
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('User created successfully!');
            document.getElementById('newName').value = '';
            document.getElementById('newEmail').value = '';
            document.getElementById('newAge').value = '';
            loadUsers();
        } else {
            showMessage(data.error || 'Failed to create user', 'error');
        }
    } catch (error) {
        showMessage('Error creating user: ' + error.message, 'error');
    }
}

// Load users (READ operation)
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (response.ok) {
            displayUsers(data);
        } else {
            showMessage(data.error || 'Failed to load users', 'error');
        }
    } catch (error) {
        showMessage('Error loading users: ' + error.message, 'error');
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.age}</td>
            <td>
                <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', ${user.age})">Edit</button>
                <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
    });
}

// Edit user - show form
function editUser(id, name, email, age) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editAge').value = age;
    document.getElementById('editForm').style.display = 'block';
}

// Update user (UPDATE operation)
async function updateUser() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const age = document.getElementById('editAge').value;

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, age: parseInt(age) })
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('User updated successfully!');
            document.getElementById('editForm').style.display = 'none';
            loadUsers();
        } else {
            showMessage(data.error || 'Failed to update user', 'error');
        }
    } catch (error) {
        showMessage('Error updating user: ' + error.message, 'error');
    }
}

// Cancel edit
function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
}

// Delete user (DELETE operation)
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('User deleted successfully!');
            loadUsers();
        } else {
            showMessage(data.error || 'Failed to delete user', 'error');
        }
    } catch (error) {
        showMessage('Error deleting user: ' + error.message, 'error');
    }
}

// Check if already logged in on page load
window.onload = async function() {
    try {
        const response = await fetch('/api/session');
        if (response.ok) {
            const session = await response.json();
            isLoggedIn = true;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('sessionInfo').style.display = 'block';
            document.getElementById('crudSection').style.display = 'block';
            document.getElementById('sessionDetails').textContent = `Welcome, ${session.username}!`;
            loadUsers();
        }
    } catch (error) {
        // User not logged in, show login form
    }
};
