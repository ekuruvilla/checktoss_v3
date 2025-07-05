import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

// Helper to build a nested tree from file paths
function buildFileTree(files, productId) {
  const root = {};
  files.forEach(file => {
    const rel = file.fileUrl.split(`/uploads/${productId}/`)[1];
    const parts = rel.split('/');
    let node = root;
    parts.forEach((part, idx) => {
      if (!node[part]) node[part] = idx === parts.length - 1 ? file : {};
      node = node[part];
    });
  });
  return root;
}

// Recursive component to render the tree
const TreeNode = ({ node, name }) => {
  const isFile = node.fileUrl !== undefined;
  const [open, setOpen] = useState(false);

  if (isFile) {
    return (
      <div style={{ paddingLeft: '1rem' }}>
        <a href={node.fileUrl} target="_blank" rel="noopener noreferrer">
          {node.title}
        </a>
        {node.version && (
          <span style={{ marginLeft: '0.5rem', color: '#666' }}>
            (v{node.version})
          </span>
        )}
        {node.createdAt && (
          <span style={{ marginLeft: '0.5rem', color: '#666' }}>
            {new Date(node.createdAt).toLocaleString()}
          </span>
        )}
        {node.description && (
          <div style={{ fontStyle: 'italic', marginLeft: '1.5rem' }}>
            {node.description}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: '0.5rem' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
      >
        {open ? '📂' : '📁'} {name}
      </div>
      {open &&
        Object.keys(node).map(key => (
          <TreeNode key={key} name={key} node={node[key]} />
        ))}
    </div>
  );
};

export default function ProductPageReadOnly() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [fileType, setFileType] = useState('all');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then(r=>r.json())
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  if (!product) return <div>Loading…</div>;

  const manualsToShow = product.manuals.filter(m => {
    if (fileType === 'all') return true;
    const ext = m.fileUrl.split('.').pop().toLowerCase();
    if (fileType === 'pdf') return ext==='pdf';
    if (fileType==='doc') return ['doc','docx'].includes(ext);
    if (fileType==='image') return ['png','jpg','jpeg','gif'].includes(ext);
    return true;
  });

  const tree = buildFileTree(manualsToShow, id);

  return (
    <div style={{padding:'2rem'}}>
      <h1>{product.name}</h1>
      <img src={product.qrCodeImage} alt="QR" style={{maxWidth:'150px'}} />

      <div style={{margin:'1rem 0'}}>
        <label>
          Filter by type:
          <select
            value={fileType}
            onChange={e=>setFileType(e.target.value)}
            style={{marginLeft:'0.5rem'}}
          >
            <option value="all">All</option>
            <option value="pdf">PDF</option>
            <option value="doc">DOC/DOCX</option>
            <option value="image">Images</option>
          </select>
        </label>
      </div>

      <h2>Manuals</h2>
      {Object.keys(tree).length === 0 
        ? <p>No manuals available.</p>
        : Object.keys(tree).map(key=>(
            <TreeNode key={key} name={key} node={tree[key]} />
          ))
      }
    </div>
  );
}
