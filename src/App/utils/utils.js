export const getDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getYMDDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const month = d.toLocaleString('default', { month: 'long' });
  const day = d.toLocaleDateString('default', { day: 'numeric' });
  return `${d.getFullYear()}-${month}-${day}`;
};
