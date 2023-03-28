export const formatDateYear = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-us', {
    year: 'numeric',
  });
};
