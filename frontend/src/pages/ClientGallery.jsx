import { Download, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';

export function ClientGallery() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/public/gallery/${token}`).then(setData).catch((err) => setError(err.message));
  }, [token]);

  async function favorite(photo) {
    const updated = await api(`/public/gallery/${token}/photos/${photo._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isFavorite: !photo.isFavorite })
    });
    setData((current) => ({
      ...current,
      photos: current.photos.map((item) => (item._id === updated._id ? updated : item))
    }));
  }

  if (error) return <div className="center-screen">{error}</div>;
  if (!data) return <div className="center-screen">Carregando galeria...</div>;

  return (
    <main className="client-gallery">
      <header>
        <h1>{data.event.clientId?.name}</h1>
        <p>{data.event.type} em {new Date(data.event.date).toLocaleDateString('pt-BR')}</p>
      </header>
      <div className="photo-grid">
        {data.photos.map((photo) => (
          <article className="photo-card" key={photo._id}>
            <img src={photo.url} alt="Foto da galeria privada" />
            <div className="photo-actions">
              <button className={photo.isFavorite ? 'active icon-button' : 'icon-button'} onClick={() => favorite(photo)}><Heart size={17} /></button>
              <a className="icon-button" href={photo.url} download target="_blank" rel="noreferrer"><Download size={17} /></a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
