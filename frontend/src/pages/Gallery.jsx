import { Check, Heart, ImagePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

  const selectedEvent = useMemo(() => events.find((event) => event._id === eventId), [events, eventId]);
  const approvedCount = photos.filter((photo) => photo.isApproved).length;
  const favoriteCount = photos.filter((photo) => photo.isFavorite).length;

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
    <section className="page ops-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Galeria</span>
          <h1>Galeria de fotos</h1>
          <p>Anexe imagens por evento e acompanhe aprovacao e favoritas.</p>
        </div>
        <div className="ops-header-control">
          <span>Evento</span>
          <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            {events.map((event) => <option key={event._id} value={event._id}>{event.type} - {event.clientId?.name}</option>)}
          </select>
        </div>
      </div>

      <div className="ops-metrics-grid four">
        <div className="ops-metric"><span>Total</span><strong>{photos.length}</strong><small>Fotos anexadas</small></div>
        <div className="ops-metric success"><span>Aprovadas</span><strong>{approvedCount}</strong><small>Selecionadas para entrega</small></div>
        <div className="ops-metric warning"><span>Favoritas</span><strong>{favoriteCount}</strong><small>Marcadas pela equipe</small></div>
        <div className="ops-metric"><span>Cliente</span><strong>{selectedEvent?.clientId?.name || '-'}</strong><small>Evento selecionado</small></div>
      </div>

      <div className="ops-workspace gallery-workspace">
        <section className="ops-section">
          <div className="ops-section-head">
            <div>
              <h2>Fotos do evento</h2>
              <p>Use os controles sobre a imagem para favoritar ou aprovar.</p>
            </div>
          </div>
          <div className="ops-photo-grid">
            {photos.map((photo) => (
              <article className="ops-photo-card" key={photo._id}>
                <img src={photo.url} alt={photo.title || 'Foto do evento'} />
                <div className="photo-actions">
                  <button className={photo.isFavorite ? 'active icon-button' : 'icon-button'} onClick={() => toggle(photo, 'isFavorite')}><Heart size={17} /></button>
                  <button className={photo.isApproved ? 'active icon-button' : 'icon-button'} onClick={() => toggle(photo, 'isApproved')}><Check size={17} /></button>
                </div>
              </article>
            ))}
            {!photos.length && <div className="ops-empty">Nenhuma foto anexada neste evento.</div>}
          </div>
        </section>

        <aside className="ops-inspector">
          <form className="ops-section" onSubmit={addPhoto}>
            <div className="ops-section-head">
              <div>
                <h2>Anexar foto</h2>
                <p>Imagem salva no evento selecionado.</p>
              </div>
            </div>
            <FormField label="Arquivo">
              <label className="file-upload compact">
                <ImagePlus size={19} />
                <div>
                  <strong>{photoFile?.name || 'Escolher foto'}</strong>
                  <span>Imagem do computador.</span>
                </div>
                <input type="file" accept="image/*" required onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
              </label>
            </FormField>
            <button className="primary-button"><ImagePlus size={18} />Adicionar</button>
          </form>
        </aside>
      </div>
    </section>
  );
}
