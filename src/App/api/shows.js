export const saveShow = async ({ title, host, date, tracks }) => {
  return fetch('/logsheet-reader/api/shows/update.php', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      type: 'update',
      show: { title, host, air_date: date },
      tracks,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error('failed to save show : ' + res.statusText);
    }
  });
};

export const getShows = async (id) => {
  const showQuery = id ? `?id=${id}` : '';
  return fetch(`/logsheet-reader/api/shows/get.php${showQuery}`, {
    method: 'GET',
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
};
