import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const hosts = ['Shaukat Husain', 'Demis Tsimon'];

export default function HostDropdown({ host, onSelectHost, name }) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (onSelectHost instanceof Function) {
      onSelectHost(value);
    }
  };
  return (
    <>
      <Form.Select name="host-dropdown" aria-label="Default select example" onChange={handleChange}>
        <option disabled defaultValue={host}>
          select
        </option>
        {hosts.map((hostName) => {
          return (
            <option key={hostName} value={hostName}>
              {hostName}
            </option>
          );
        })}
      </Form.Select>

      {/* <Dropdown name={name} onSelect={onSelectHost} variant="primary">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {host ? host : 'select'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {hosts.map((hostName) => {
            return (
              <Dropdown.Item key={hostName} eventKey={hostName} active={host == hostName}>
                {hostName}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown> */}
    </>
  );
}
