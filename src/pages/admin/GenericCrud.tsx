/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface GenericCrudProps {
  title: string;
  endpoint: string;
  updateMethod?: 'put' | 'patch';
  columns: { key: string; label: string; render?: (val: any, item: any) => any }[];
  fields: { name: string; label: string; type: string; required?: boolean; options?: { label: string; value: any }[] }[];
}

export default function GenericCrud({ title, endpoint, updateMethod = 'put', columns, fields }: GenericCrudProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setItems(response.data);
    } catch (err) {
      console.error(err);
      setError(`Erro ao carregar ${title}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setEditingItem(null);
    setFormData({});
    setError('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const handleCreateNew = () => {
    setEditingItem('NEW');
    setFormData({});
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...formData };
      
      // Converte numbers
      fields.forEach(f => {
        if (f.type === 'number' && payload[f.name] !== undefined) {
          payload[f.name] = Number(payload[f.name]);
        }
      });

      if (editingItem === 'NEW') {
        delete payload.id;
        await api.post(endpoint, payload);
      } else {
        const id = editingItem.id;
        delete payload.id;
        if (updateMethod === 'patch') {
          await api.patch(`${endpoint}/${id}`, payload);
        } else {
          await api.put(`${endpoint}/${id}`, payload);
        }
      }
      fetchItems();
      setEditingItem(null);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data?.error || `Erro ao salvar ${title}`;
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-header border-secondary d-flex justify-content-between align-items-center py-3">
        <h3 className="mb-0 text-warning"><i className="bi bi-gear-fill me-2"></i>Gerenciar {title}</h3>
        {!editingItem && (
          <button onClick={handleCreateNew} className="btn btn-warning fw-bold text-dark">
            <i className="bi bi-plus-circle me-1"></i> Criar Novo
          </button>
        )}
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {editingItem ? (
          <form onSubmit={handleSubmit} className="p-3 border border-secondary rounded bg-black">
            <h5 className="text-warning mb-3">{editingItem === 'NEW' ? 'Novo Registro' : 'Editar Registro'}</h5>
            <div className="row g-3">
              {fields.map(f => (
                <div key={f.name} className="col-md-6">
                  <label className="form-label text-secondary">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      className="form-control bg-dark text-light border-secondary"
                      required={f.required}
                      value={formData[f.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      {f.options?.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      className="form-control bg-dark text-light border-secondary"
                      required={f.required}
                      value={formData[f.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-warning text-dark fw-bold">Salvar</button>
              <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline-secondary">Cancelar</button>
            </div>
          </form>
        ) : loading ? (
          <div className="text-center py-5"><div className="spinner-border text-warning" role="status"></div></div>
        ) : items.length === 0 ? (
          <div className="text-center py-5 text-secondary">Nenhum registro encontrado.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-bordered align-middle">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  {columns.map(c => <th key={c.key}>{c.label}</th>)}
                  <th style={{ width: '150px' }} className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    {columns.map(c => (
                      <td key={c.key}>{c.render ? c.render(item[c.key], item) : item[c.key]}</td>
                    ))}
                    <td className="text-center">
                      <button onClick={() => handleEdit(item)} className="btn btn-sm btn-outline-warning me-2" title="Editar">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger" title="Excluir">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
