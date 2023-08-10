import { createClient } from '@supabase/supabase-js';
import { ref } from 'vue';

const supabase = createClient(
    import.meta.env.VITE_APP_SUPABASE_URL,
    import.meta.env.VITE_APP_SUPABASE_KEY,
);

const userSession = ref(null);
const profile = ref(null);

const setProfile = async () => {
    if (userSession?.value?.user?.id) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userSession.value.user.id);
        profile.value = data[0];
    } else {
        profile.value = null;
    }
};

export { profile, setProfile, supabase, userSession };
