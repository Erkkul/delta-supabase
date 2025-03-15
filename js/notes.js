// Gestion des notes
let notes = [];

// Charger les notes de l'utilisateur
async function loadNotes() {
  if (!currentUser) {
    console.error('loadNotes: currentUser is not defined');
    return;
  }

  console.log('Chargement des notes pour l\'utilisateur:', currentUser.id);
  
  try {
    const { data, error } = await supabaseClient
      .from('notes')
      .select('*')
      .eq('user_id', currentUser.id)  // Filtrage par user_id
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log('Notes chargées:', data);
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
  
  // Vider complètement la liste actuelle sauf le message "aucune note"
  const notesToRemove = [];
  for (let i = 0; i < notesList.children.length; i++) {
    if (notesList.children[i] !== noNotesMessage) {
      notesToRemove.push(notesList.children[i]);
    }
  }
  notesToRemove.forEach(node => node.remove());
  
  // Afficher ou masquer le message "aucune note"
  if (notes.length === 0) {
    noNotesMessage.style.display = 'block';
    return;
  } else {
    noNotesMessage.style.display = 'none';
  }
  
  // Créer un élément pour chaque note avec des gestionnaires d'événements
  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note-card';
    noteElement.dataset.id = note.id; // Stocker l'ID dans un attribut data
    
    noteElement.innerHTML = `
      <div class="note-title">${note.title}</div>
      <div class="note-content">${note.content || ''}</div>
      <div class="note-footer">
        <span>${formatDate(note.created_at)}</span>
        <div class="note-actions">
          <button class="edit-note-btn btn btn-sm">Modifier</button>
          <button class="delete-note-btn btn btn-sm btn-danger">Supprimer</button>
        </div>
      </div>
    `;
    
    // Ajouter les écouteurs d'événements directement sur les boutons
    const editButton = noteElement.querySelector('.edit-note-btn');
    const deleteButton = noteElement.querySelector('.delete-note-btn');
    
    editButton.addEventListener('click', () => editNote(note.id));
    deleteButton.addEventListener('click', () => deleteNote(note.id));
    
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
  if (!currentUser) {
    console.error('saveNote: currentUser is not defined');
    showToast('Erreur: Utilisateur non connecté', 'error');
    return;
  }
  
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
      const { data, error } = await supabaseClient
        .from('notes')
        .update({
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);
      
      if (error) throw error;
      console.log('Note mise à jour:', data);
      showToast('Note mise à jour avec succès', 'success');
    } else {
      // Création d'une nouvelle note
      console.log('Création de note avec user_id:', currentUser.id);
      const newNote = {
        title,
        content,
        user_id: currentUser.id
      };
      
      console.log('Objet note à insérer:', newNote);
      
      const { data, error } = await supabaseClient
        .from('notes')
        .insert([newNote]);
      
      if (error) {
        console.error('Erreur d\'insertion:', error);
        throw error;
      }
      
      console.log('Note créée:', data);
      showToast('Note créée avec succès', 'success');
    }
    
    hideNoteForm();
    await loadNotes(); // Recharger les notes après sauvegarde
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
    
    // Supprimer localement de l'array notes
    notes = notes.filter(note => note.id !== noteId);
    
    showToast('Note supprimée avec succès', 'success');
    renderNotes(); // Refaire le rendu au lieu de recharger complètement
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error.message);
    showToast(`Erreur: ${error.message}`, 'error');
  }
}