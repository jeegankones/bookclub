import { defineStore } from 'pinia';
import { fetchUserRoleById } from '../api/profiles';
import { useAlertStore } from './useAlertStore';

export const useSessionStore = defineStore('session', {
    state: () => ({
        session: null,
        userRole: null,
    }),
    getters: {
        isLoggedIn: (state) => {
            return Boolean(state.session);
        },
        userId: (state) => {
            return state.session?.user?.id;
        },
        userName: (state) => {
            return state.session?.user?.user_metadata.full_name;
        },
        userAvatar: (state) => {
            return state.session?.user?.user_metadata.avatar_url;
        },
        userEmail: (state) => {
            return state.session?.user?.email;
        },
    },
    actions: {
        async setSession(session) {
            this.session = session;
            await this.fetchUserRole();
        },
        async fetchUserRole() {
            if (!this.userId) {
                this.userRole = null;
                return;
            }

            const { data, error } = await fetchUserRoleById(this.userId);

            if (error) {
                useAlertStore().newAlert('Could not fetch user role. Try refreshing the page.');
                return;
            }

            this.userRole = data.role;
        },
    },
});
