import React from 'react';

function ManualList({ manuals }) {
  if (!manuals?.length) return <p>No manuals available.</p>;

  return (
    <ul>
      {manuals.map(m => (
        <li key={m._id}>
          <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
            {m.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default ManualList;
