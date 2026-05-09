import { Check, Heart, ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.jsx';
import { imageFileToDataUrl } from '../utils/images.js';

export function Gallery() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    api('/events').then((items) => {
      setEvents(items);
      setEventId(items[0]?._id || '');
    });
  }, []);

  useEffect(() => {
    if (eventId) api(`/photos?eventId=${eventId}`).then(setPhotos).catch(console.error);
  }, [eventId]);

  async function addPhoto(event) {
    event.preventDefault();
    if (!photoFile) return;

    const url = await imageFileToDataUrl(photoFile, 1800, 0.86);
    await api('/photos', { method: 'POST', body: JSON.stringify({ eventId, url, title: photoFile.name }) });
    setPhotoFile(null);
    event.target.reset();
    setPhotos(await api(`/photos?eventId=${eventId}`));
  }

  async function toggle(photo, field) {
    const updated = await api(`/photos/${photo._id}`, {
      method: 'PUT',
      body: JSON.stringify({ [field]: !photo[field] })
    });
    setPhotos((items) => items.map((item) => (item._id === updated._id ? updated : item)));
  }

  return (
    <section className="page">
      <div className="page-title">
        <h1>Galeria de fotos</h1>
        <p>Anexe imagens, organize por evento e acompanhe aprovacao e favoritas.</p>
      </div>
      <div className="panel form-line">
        <FormField label="Evento">
          <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            {events.map((event) => <option key={event._id} value={event._id}>{event.type} - {event.clientId?.name}</option>)}
          </select>
        </FormField>
        <form onSubmit={addPhoto} className="inline-form">
          <label className="file-upload compact">
            <ImagePlus size={19} />
            <div>
              <strong>{photoFile?.name || 'Anexar foto'}</strong>
              <span>Escolha uma imagem do computador.</span>
            </div>
            <input type="file" accept="image/*" required onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
          </label>
          <button className="primary-button"><ImagePlus size={18} />Adicionar</button>
        </form>
      </div>
      <div className="photo-grid">
        {photos.map((photo) => (
          <article className="photo-card" key={photo._id}>
            <img src={photo.url} alt={photo.title || 'Foto do evento'} />
            <div className="photo-actions">
              <button className={photo.isFavorite ? 'active icon-button' : 'icon-button'} onClick={() => toggle(photo, 'isFavorite')}><Heart size={17} /></button>
              <button className={photo.isApproved ? 'active icon-button' : 'icon-button'} onClick={() => toggle(photo, 'isApproved')}><Check size={17} /></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
