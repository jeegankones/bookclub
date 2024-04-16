import { supabase } from '../lib/supabase';

function fetchUserRoleById(userId) {
    return supabase.from('profiles').select('role').eq('id', userId).limit(1).single();
}

export { fetchUserRoleById };
