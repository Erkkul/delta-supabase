// Point d'entrée de l'application
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'utilisateur est connecté
  checkUser();
  
  // Gérer les événements d'authentification
  document.getElementById('login-btn').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
  });
  
  document.getElementById('signup-btn').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
  });
  
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  // Formulaire de connexion
  document.querySelector('#login-form form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    login(email, password);
  });
  
  // Formulaire d'inscription
  document.querySelector('#signup-form form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const username = document.getElementById('signup-username').value;
    signUp(email, password, username);
  });
  
  // Gérer les événements de notes
  document.getElementById('add-note-btn').addEventListener('click', () => {
    showNoteForm();
  });
  
  document.getElementById('save-note-btn').addEventListener('click', () => {
    saveNote();
  });
  
  document.getElementById('cancel-note-btn').addEventListener('click', () => {
    hideNoteForm();
  });
});