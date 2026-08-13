const usersList = document.getElementById('usersList');
const userForm = document.getElementById('userForm');
const submitBtn = document.getElementById('submitBtn');
const loadUsersBtn = document.getElementById('loadUsersBtn');
const totalUsersEl = document.getElementById('totalUsers');
const apiStatusEl = document.getElementById('apiStatus');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');

const toast = document.getElementById('toast');
let toastTimeout;

function showToast(text, type = 'info') {
  clearTimeout(toastTimeout);
  toast.textContent = text;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => toast.classList.add('show'));
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function setLoading(button, isLoading) {
  const label = button.querySelector('.btn-label');
  const icon = button.querySelector('.icon');
  if (!label) return;

  if (isLoading) {
    button.dataset.original = label.textContent;
    label.textContent = 'Loading...';
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    button.prepend(spinner);
    if (icon) icon.style.display = 'none';
    button.disabled = true;
  } else {
    label.textContent = button.dataset.original || 'Refresh';
    button.dataset.original = undefined;
    const spinner = button.querySelector('.spinner');
    if (spinner) spinner.remove();
    if (icon) icon.style.display = '';
    button.disabled = false;
  }
}

function clearFieldErrors() {
  nameInput.classList.remove('invalid');
  emailInput.classList.remove('invalid');
  nameError.textContent = '';
  emailError.textContent = '';
}

function markInvalid(input, errorEl, text) {
  input.classList.add('invalid');
  errorEl.textContent = text;
}

function validateForm() {
  clearFieldErrors();
  let valid = true;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name) {
    markInvalid(nameInput, nameError, 'Name is required.');
    valid = false;
  }

  if (!email) {
    markInvalid(emailInput, emailError, 'Email is required.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    markInvalid(emailInput, emailError, 'Please provide a valid email address.');
    valid = false;
  }

  return valid;
}

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function avatarColorFor(id) {
  const palette = [
    ['#1f6f78', '#16525a'],
    ['#5b4b8a', '#3f3363'],
    ['#a05a2c', '#743d1b'],
    ['#2e7d51', '#1f5c3c'],
    ['#8a4a6b', '#63334d']
  ];
  return palette[id % palette.length];
}

function renderUsers(users) {
  totalUsersEl.textContent = users.length;

  if (users.length === 0) {
    usersList.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">✉</span>
        <p><strong>No users available yet.</strong></p>
        <p>Use the form to add your first user.</p>
      </div>
    `;
    return;
  }

  usersList.innerHTML = users
    .map((user, index) => {
      const [from, to] = avatarColorFor(user.id || index);
      return `
      <article class="user-card">
        <span class="avatar" style="background: linear-gradient(135deg, ${from}, ${to});">${initialsOf(user.name)}</span>
        <div class="user-info">
          <h3>${escapeHtml(user.name)}</h3>
          <p class="user-meta">
            <svg class="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>${escapeHtml(user.email)}
          </p>
        </div>
        <span class="user-id">ID: ${user.id}</span>
      </article>
    `;
    })
    .join('');
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = String(value);
  return div.innerHTML;
}

function setApiStatus(online) {
  apiStatusEl.textContent = online ? 'Online' : 'Offline';
  apiStatusEl.classList.toggle('online', online);
}

async function fetchUsers(showFeedback = true) {
  setLoading(loadUsersBtn, true);

  try {
    const response = await fetch('/api/users');
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(responseBody.message || 'Failed to load users');
    }

    setApiStatus(true);
    renderUsers(responseBody.data);
    if (showFeedback) showToast(responseBody.message, 'success');
  } catch (error) {
    setApiStatus(false);
    usersList.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">⚠</span>
        <p><strong>Could not reach the API.</strong></p>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
    totalUsersEl.textContent = '0';
    if (showFeedback) showToast(error.message, 'error');
  } finally {
    setLoading(loadUsersBtn, false);
  }
}

async function saveUser(event) {
  event.preventDefault();

  if (!validateForm()) {
    showToast('Please fix the highlighted fields.', 'error');
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim()
  };

  setLoading(submitBtn, true);

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }

    userForm.reset();
    clearFieldErrors();
    showToast(result.message, 'success');
    await fetchUsers(false);
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setLoading(submitBtn, false);
  }
}

userForm.addEventListener('submit', saveUser);
loadUsersBtn.addEventListener('click', () => fetchUsers(true));
nameInput.addEventListener('input', clearFieldErrors);
emailInput.addEventListener('input', clearFieldErrors);

fetchUsers(false);