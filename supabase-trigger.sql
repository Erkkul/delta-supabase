-- Fonction qui crée automatiquement un profil pour chaque nouvel utilisateur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.email, null);
  return new;
end;
$$ language plpgsql security definer;

-- Déclencheur qui se déclenche après l'insertion d'un nouvel utilisateur
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
