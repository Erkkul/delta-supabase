// Configuration du client Supabase
const supabaseUrl = 'https://rcmuejvaxqzbynsezjkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbXVlanZheHF6Ynluc2V6amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjU2NjcsImV4cCI6MjA1NzY0MTY2N30.R4qdgjcGIcG3FovE9duZe-yH6Q0asNMIxbCHaWNI6Wc';

// Le CDN unpkg de Supabase expose la classe Supabase globalement
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Fonction pour afficher les messages toast
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show';
  if (type) {
    toast.classList.add(type);
  }

  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// Fonction pour formatter les dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}