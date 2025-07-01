import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ManualList from '../components/ManualList';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <img src={product.qrCodeImage} alt="QR Code for product" />
      <ManualList manuals={product.manuals} />
    </div>
  );
}

export default ProductPage;
