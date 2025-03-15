// Gestion du profil utilisateur

// Mettre à jour le nom d'utilisateur
async function updateUsername(newUsername) {
  if (!currentUser) return;
  
  try {
    const { error } = await supabaseClient
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', currentUser.id);
      
    if (error) throw error;
    
    document.getElementById('username').textContent = newUsername;
    showToast('Nom d\'utilisateur mis à jour avec succès', 'success');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error.message);
    showToast(`Erreur: ${error.message}`, 'error');
  }
}

// Afficher le formulaire de modification du profil
function showProfileForm() {
  // Cette fonction peut être utilisée dans une future amélioration
  // pour permettre à l'utilisateur de modifier son profil
  console.log('Formulaire de profil non implémenté');
}