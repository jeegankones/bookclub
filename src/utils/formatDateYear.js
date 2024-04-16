export function formatDateYear(dateString) {
    return new Date(dateString).toLocaleDateString('en-us', {
        year: 'numeric',
    });
}
