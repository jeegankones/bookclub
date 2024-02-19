import { supabase } from '../lib/supabase';

function getSettings() {
    return supabase.from('settings').select('*');
}

export { getSettings };
