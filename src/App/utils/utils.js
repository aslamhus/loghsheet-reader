export const getDate = (dateString) => {
  const d = new Date(dateString.replace(/-/g, '/'));
  // return d.toDateString();

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
