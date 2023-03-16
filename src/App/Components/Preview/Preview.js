import React from 'react';
import Table from '../Table/Table.js';
import './preview.css';

const Preview = React.forwardRef((props, ref) => {
  const { tracks } = props;
  console.log('tracks', tracks);
  if (!tracks) return null;

  return (
    <div ref={ref}>
      <h1>Preview</h1>
      {/* {tracks.map((row) => {
        return <div className="row"></div>;
      })} */}
      <Table dataSource={tracks} enableCheckbox={false}>
        {/* <Table.TitleBar title={'Tracks'} /> */}
        <Table.Head>
          <Table.Cell title="Track Title" size="m" />
          <Table.Cell title="Artist" size="l" right />
          <Table.Cell title="Album " size="xxs" right />
        </Table.Head>
        <Table.Body>
          <Row></Row>
        </Table.Body>
      </Table>
    </div>
  );
});

const Row = ({ data }) => {
  //   console.log('data', data);
  return (
    <Table.Row>
      <Table.Row.Cells>
        <Table.Cell size="m">
          <p>{data['Track Title']}</p>
        </Table.Cell>
        <Table.Cell size="l">
          <p>{data.Artist}</p>
        </Table.Cell>
        <Table.Cell size="xxs">
          <p>{data['Album Title']}</p>
        </Table.Cell>
      </Table.Row.Cells>
    </Table.Row>
  );
};

export default Preview;
