import { supabase } from '../lib/supabase';

function getSettings() {
    return supabase.from('settings').select('*');
}

function updateSetting(setting, value) {
    return supabase.from('settings').update({ value }).match({ setting }).select();
}

export { getSettings, updateSetting };
