import * as pdfjsLib from 'pdfjs-dist/webpack';

let PDF_COLUMNS, tracks;

export const extractTrackData = async (file) => {
  tracks = [];
  PDF_COLUMNS = [
    { name: 'Artist', minMax: [], values: [] },
    { name: 'Album Title', minMax: [], values: [] },
    { name: 'Track Title', minMax: [], values: [] },
    { name: 'CanCon', minMax: [] },
  ];
  const loadingTask = pdfjsLib.getDocument(file);
  const doc = await loadingTask.promise.then((doc) => doc);
  const text = await getAllTextContent(doc);
  console.log('text', text);
  const trackData = parseTextContent(text);
  return trackData;
};

const getAllTextContent = async (doc) => {
  let textContent = { items: [] };
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const text = await page.getTextContent();
    textContent.items.push(...text.items);
  }
  return textContent;
};

const parseTextContent = (textContent) => {
  const date = findDate(textContent);
  parseColumns(textContent);
  findFields(textContent);
  const tracks = filterRows();
  return { date, tracks };
};

const parseColumns = (textContent) => {
  // set min x
  textContent.items.forEach((item) => {
    let { str, transform } = item;
    str = str.trim();
    PDF_COLUMNS.forEach((column, index) => {
      const { name } = column;
      const [firstWordOfColumnName] = name.split(' ');
      // we only need first word for minX of column
      if (str == name || str == firstWordOfColumnName) {
        const x = transform[4];
        PDF_COLUMNS[index].minMax = [x];
      }
    });
  });
  // set max x
  PDF_COLUMNS.forEach((column, index) => {
    const nextColumn = PDF_COLUMNS[index + 1];
    if (nextColumn) {
      PDF_COLUMNS[index].minMax[1] = nextColumn.minMax[0];
    }
  });
  // remove last column (CanCon) (which is only used to get max of real last column)
  PDF_COLUMNS.splice(3, 1);
  return PDF_COLUMNS;
};

const findFields = (textContent) => {
  let trackObj = {};
  textContent.items.forEach((item) => {
    const { str, transform } = item;
    const x = transform[4];
    for (let column of PDF_COLUMNS) {
      const [minX, maxX] = column.minMax;
      if (x >= minX && x < maxX) {
        // item belongs in column
        trackObj[column.name] = `${trackObj?.[column.name] || ''}${str}`;
      }
    }
    if (x > PDF_COLUMNS[PDF_COLUMNS.length - 1].minMax[1]) {
      tracks.push(trackObj);
      trackObj = {};
    }
  });
};

const findDate = (textContent) => {
  let date,
    index = 0;
  for (let item of textContent.items) {
    if (item.str.indexOf('Date') > -1) {
      date = textContent.items[index + 1].str;
      break;
    }
    index++;
  }
  return date;
};

const filterRows = () => {
  let columnStartRows = -1,
    columnEndRows = -1;
  let filteredTracks = tracks.filter((row) => {
    if (row.Artist) {
      return row;
    }
  });
  filteredTracks.forEach((row, index) => {
    if (row[PDF_COLUMNS[0].name] == PDF_COLUMNS[0].name) {
      columnStartRows = index;
    }
    if (row?.Artist.indexOf('Total Tracks') > -1) {
      columnEndRows = index;
    }
  });
  filteredTracks.splice(0, columnStartRows + 1);
  columnEndRows = columnEndRows - columnStartRows - 1;
  filteredTracks.splice(columnEndRows, filteredTracks.length - columnEndRows);
  return filteredTracks;
};
