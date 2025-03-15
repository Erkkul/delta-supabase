// Gestion de l'authentification
let currentUser = null;

// Vérifier si l'utilisateur est connecté au chargement
async function checkUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    currentUser = session.user;
    try {
      await fetchUserProfile();
    } catch (error) {
      console.error('Erreur lors de la récupération du profil, mais continuation de la session:', error.message);
      // Continuer même si la récupération du profil échoue
    }
    showApp();
  } else {
    showAuth();
  }
}

// Recuperer le profil utilisateur
async function fetchUserProfile() {
  try {
    console.log('Recherche du profil pour l\'utilisateur ID:', currentUser.id);
    
    // Vérifier d'abord si le profil existe
    const { data, error, count } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('id', currentUser.id);

    if (error) throw error;
    
    console.log('Profils trouvés:', data ? data.length : 0);

    // Si aucun profil n'est trouvé, on en crée un manuellement
    if (!data || data.length === 0) {
      console.log('Aucun profil trouvé, création d\'un nouveau profil');
      const { error: createError } = await supabaseClient
        .from('profiles')
        .insert([{ 
          id: currentUser.id, 
          username: currentUser.email,
          avatar_url: null 
        }]);
      
      if (createError) throw createError;
      
      // Récupérer le profil nouvellement créé
      const { data: newProfile, error: fetchError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();  // Utiliser maybeSingle au lieu de single
        
      if (fetchError) throw fetchError;
      
      if (newProfile) {
        document.getElementById('username').textContent = newProfile.username || currentUser.email;
      } else {
        document.getElementById('username').textContent = currentUser.email;
      }
    } else {
      // Profil trouvé
      document.getElementById('username').textContent = data[0].username || currentUser.email;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error.message);
    document.getElementById('username').textContent = currentUser ? currentUser.email : 'Utilisateur';
    throw error;  // Propager l'erreur pour permettre à la fonction appelante de la gérer
  }
}

// Connexion
async function login(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    currentUser = data.user;
    try {
      await fetchUserProfile();
    } catch (error) {
      console.error('Erreur lors de la récupération du profil après connexion:', error.message);
      // Continuer même si la récupération du profil échoue
    }
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
    
    // Le déclencheur PostgreSQL devrait s'occuper de créer le profil,
    // mais on pourrait ajouter une gestion de secours ici si nécessaire
    
    showToast('Inscription réussie! Vérifiez votre email pour confirmer votre compte.', 'success');
    showAuth(); // Rediriger vers la page de connexion
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