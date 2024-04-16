const isLocal = import.meta.env.DEV && import.meta.env.MODE === 'localBackend';
const isDev = import.meta.env.DEV && import.meta.env.MODE !== 'localBackend';

export { isDev, isLocal };
