let editingId = null;

async function loadNotes() {
    const res = await fetch('/notes');
    const data = await res.json();
    const list = document.getElementById('notes-list');
    list.innerHTML = data.map(n => `
        <div class="note-card">
            <h3>${escapeHtml(n.title)}</h3>
            <p>${escapeHtml(n.content)}</p>
            <div class="meta">Created: ${new Date(n.created_at).toLocaleString()}</div>
            <div class="actions">
                <button class="btn-edit" onclick="editNote(${n.id}, '${escapeJs(n.title)}', '${escapeJs(n.content)}')">Edit</button>
                <button class="btn-delete" onclick="deleteNote(${n.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function saveNote() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    if (!title) return alert('Title is required');

    if (editingId) {
        await fetch(`/notes/${editingId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, content})
        });
        editingId = null;
        document.querySelector('.form-card button').textContent = 'Add Note';
    } else {
        await fetch('/notes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, content})
        });
    }
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    loadNotes();
}

function editNote(id, title, content) {
    editingId = id;
    document.getElementById('title').value = title;
    document.getElementById('content').value = content;
    document.querySelector('.form-card button').textContent = 'Update Note';
}

async function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    await fetch(`/notes/${id}`, {method: 'DELETE'});
    loadNotes();
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escapeJs(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

loadNotes();
