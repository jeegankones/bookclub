import { supabase } from '../lib/supabase';

function fetchUserRoleById(userId) {
    return supabase.from('profiles').select('role').eq('id', userId);
}

export { fetchUserRoleById };
