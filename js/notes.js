// Gestion des notes
let notes = [];

// Charger les notes de l'utilisateur
async function loadNotes() {
  if (!currentUser) return;

  try {
    const { data, error } = await supabaseClient
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    notes = data || [];
    renderNotes();
  } catch (error) {
    console.error('Erreur lors du chargement des notes:', error.message);
    showToast(`Erreur: ${error.message}`, 'error');
  }
}

// Afficher les notes dans l'interface
function renderNotes() {
  const notesList = document.getElementById('notes-list');
  const noNotesMessage = document.getElementById('no-notes-message');
  
  // Vider la liste actuelle
  while (notesList.firstChild && notesList.firstChild !== noNotesMessage) {
    notesList.removeChild(notesList.firstChild);
  }
  
  // Afficher ou masquer le message "aucune note"
  if (notes.length === 0) {
    noNotesMessage.style.display = 'block';
    return;
  } else {
    noNotesMessage.style.display = 'none';
  }
  
  // Créer un élément pour chaque note
  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note-card';
    noteElement.innerHTML = `
      <div class="note-title">${note.title}</div>
      <div class="note-content">${note.content || ''}</div>
      <div class="note-footer">
        <span>${formatDate(note.created_at)}</span>
        <div class="note-actions">
          <button class="btn btn-sm" onclick="editNote('${note.id}')">Modifier</button>
          <button class="btn btn-sm btn-danger" onclick="deleteNote('${note.id}')">Supprimer</button>
        </div>
      </div>
    `;
    notesList.appendChild(noteElement);
  });
}

// Afficher le formulaire de création d'une note
function showNoteForm(noteId = null) {
  const form = document.getElementById('note-form');
  const noteIdInput = document.getElementById('note-id');
  const titleInput = document.getElementById('note-title');
  const contentInput = document.getElementById('note-content');
  
  // Réinitialiser manuellement les champs du formulaire
  noteIdInput.value = '';
  titleInput.value = '';
  contentInput.value = '';
  
  // Si on édite une note existante
  if (noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      noteIdInput.value = note.id;
      titleInput.value = note.title;
      contentInput.value = note.content || '';
    }
  }
  
  form.style.display = 'block';
}

// Masquer le formulaire de note
function hideNoteForm() {
  document.getElementById('note-form').style.display = 'none';
}

// Enregistrer une note (création ou modification)
async function saveNote() {
  const noteId = document.getElementById('note-id').value;
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value.trim();
  
  if (!title) {
    showToast('Le titre est obligatoire', 'error');
    return;
  }
  
  try {
    if (noteId) {
      // Mise à jour d'une note existante
      const { error } = await supabaseClient
        .from('notes')
        .update({
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);
      
      if (error) throw error;
      showToast('Note mise à jour avec succès', 'success');
    } else {
      // Création d'une nouvelle note
      const { error } = await supabaseClient
        .from('notes')
        .insert([{
          title,
          content,
          user_id: currentUser.id
        }]);
      
      if (error) throw error;
      showToast('Note créée avec succès', 'success');
    }
    
    hideNoteForm();
    await loadNotes();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la note:', error.message);
    showToast(`Erreur: ${error.message}`, 'error');
  }
}

// Éditer une note existante
function editNote(noteId) {
  showNoteForm(noteId);
}

// Supprimer une note
async function deleteNote(noteId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
    return;
  }
  
  try {
    const { error } = await supabaseClient
      .from('notes')
      .delete()
      .eq('id', noteId);
    
    if (error) throw error;
    
    showToast('Note supprimée avec succès', 'success');
    await loadNotes();
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error.message);
    showToast(`Erreur: ${error.message}`, 'error');
  }
}