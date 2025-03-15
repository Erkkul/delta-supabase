// Gestion de l'authentification
let currentUser = null;

// Vérifier si l'utilisateur est connecté au chargement
async function checkUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    currentUser = session.user;
    await fetchUserProfile();
    showApp();
  } else {
    showAuth();
  }
}

// Recuperer le profil utilisateur
async function fetchUserProfile() {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (error) throw error;

    if (data) {
      document.getElementById('username').textContent = data.username || currentUser.email;
    } else {
      document.getElementById('username').textContent = currentUser.email;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error.message);
    document.getElementById('username').textContent = currentUser.email;
  }
}

// Connexion
async function login(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    currentUser = data.user;
    await fetchUserProfile();
    showApp();
    showToast('Connexion réussie', 'success');
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
    showToast(`Erreur de connexion: ${error.message}`, 'error');
  }
}

// Inscription
async function signUp(email, password, username) {
  try {
    // Créer un utilisateur
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    
    if (error) throw error;
    
    currentUser = data.user;
    
    // Créer un profil pour l'utilisateur
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert([
        { id: currentUser.id, username, avatar_url: null }
      ]);
      
    if (profileError) throw profileError;
    
    await fetchUserProfile();
    showApp();
    showToast('Inscription réussie! Vérifiez votre email pour confirmer votre compte.', 'success');
  } catch (error) {
    console.error('Erreur d\'inscription:', error.message);
    showToast(`Erreur d'inscription: ${error.message}`, 'error');
  }
}

// Déconnexion
async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) throw error;
    
    currentUser = null;
    showAuth();
    showToast('Déconnexion réussie', 'success');
  } catch (error) {
    console.error('Erreur de déconnexion:', error.message);
    showToast(`Erreur de déconnexion: ${error.message}`, 'error');
  }
}

// Afficher l'interface d'authentification
function showAuth() {
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('app-section').style.display = 'none';
  document.getElementById('login-btn').style.display = 'inline-block';
  document.getElementById('signup-btn').style.display = 'inline-block';
  document.getElementById('logout-btn').style.display = 'none';
}

// Afficher l'application
function showApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
  document.getElementById('login-btn').style.display = 'none';
  document.getElementById('signup-btn').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'inline-block';
  loadNotes(); // Charger les notes de l'utilisateur
}