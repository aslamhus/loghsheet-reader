import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const hosts = ['Shaukat Husain', 'Demis Tsimon'];

export default function HostDropdown({ host, onSelectHost, name }) {
  return (
    <>
      <Dropdown name={name} onSelect={onSelectHost} variant="primary">
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
      </Dropdown>
    </>
  );
}
