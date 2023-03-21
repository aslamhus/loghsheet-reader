export const updateShow = async ({ showId, title, host, date, tracks }) => {
  return fetch('/straight-no-chaser/api/shows/update.php', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      type: 'update',
      show: { showId, title, host, air_date: date },
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

export const createShow = async ({ title, host, date, tracks, replace = false }) => {
  console.log(title, host, date, tracks, `replace: ${replace}`);
  return fetch('/straight-no-chaser/api/shows/create.php', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      type: 'create',
      show: { title, host, air_date: date },
      tracks,
      replace,
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
  return fetch(`/straight-no-chaser/api/shows/get.php${showQuery}`, {
    method: 'GET',
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
};

/**
 *
 * @param {Array<Number>} ids
 */
export const deleteShows = async (ids) => {
  return fetch(`/straight-no-chaser/api/shows/delete.php`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      type: 'delete',
      ids,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error('Deleting shows failed. ' + res.statusText);
    }
  });
};
