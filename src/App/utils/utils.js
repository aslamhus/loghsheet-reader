export const getDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString.replace(/-/g, '/'));

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
