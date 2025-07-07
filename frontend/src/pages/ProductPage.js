import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAuthFetch from '../useAuthFetch';

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

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [fileType, setFileType] = useState('all');
  const versionRef = useRef();
  const descRef = useRef();
  const fileInputRef = useRef();
  const [msg, setMsg] = useState('');
  const authFetch = useAuthFetch();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Fetch product failed', err));
  };

  const handleUpload = async e => {
    e.preventDefault();
    setMsg('');
    const files = fileInputRef.current.files;
    if (!files.length) {
      setMsg('Please choose at least one file.');
      return;
    }
    const version = versionRef.current.value.trim();
    const description = descRef.current.value.trim();

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('manuals', file));
    if (version) formData.append('version', version);
    if (description) formData.append('description', description);

    try {
      const res = await authfetch(
        `${process.env.REACT_APP_API_URL}/manuals/${id}`,
        { method: 'POST', body: formData }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
      setMsg('Upload successful!');
      fileInputRef.current.value = '';
      versionRef.current.value = '';
      descRef.current.value = '';
      fetchProduct();
    } catch (err) {
      console.error('Upload failed', err);
      setMsg(`Upload error: ${err.message}`);
    }
  };

  if (!product) return <div>Loading…</div>;

  // Filter manuals by selected file type
  const manualsToShow = product.manuals.filter(m => {
    if (fileType === 'all') return true;
    const ext = m.fileUrl.split('.').pop().toLowerCase();
    if (fileType === 'pdf') return ext === 'pdf';
    if (fileType === 'doc') return ext === 'doc' || ext === 'docx';
    if (fileType === 'image')
      return ['png', 'jpg', 'jpeg', 'gif'].includes(ext);
    return true;
  });

  const tree = buildFileTree(manualsToShow, id);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <img
        src={product.qrCodeImage}
        alt="QR Code for product"
        style={{ maxWidth: '150px' }}
      />

      {/* File-type filter */}
      <section style={{ margin: '1rem 0' }}>
        <label>
          Filter by type:
          <select
            value={fileType}
            onChange={e => setFileType(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="all">All</option>
            <option value="pdf">PDF</option>
            <option value="doc">DOC/DOCX</option>
            <option value="image">Images</option>
          </select>
        </label>
      </section>

      {/* Upload form */}
      <section style={{ margin: '1.5rem 0' }}>
        <h2>Upload Manuals (metadata optional)</h2>
        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Version:
              <input
                type="text"
                ref={versionRef}
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Description:
              <input
                type="text"
                ref={descRef}
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,image/*"
              multiple
            />
            <button
              type="submit"
              style={{ marginLeft: '1rem' }}
            >
              Upload
            </button>
          </div>
        </form>
        {msg && <p>{msg}</p>}
      </section>

      {/* Tree view of manuals */}
      <section>
        <h2>Manuals</h2>
        {Object.keys(tree).length === 0 ? (
          <p>No manuals available.</p>
        ) : (
          Object.keys(tree).map(key => (
            <TreeNode key={key} name={key} node={tree[key]} />
          ))
        )}
      </section>
    </div>
  );
}
