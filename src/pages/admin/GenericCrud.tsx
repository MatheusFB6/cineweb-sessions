/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface FieldDef {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  fullWidth?: boolean;
}

interface GenericCrudProps {
  title: string;
  endpoint: string;
  updateMethod?: 'put' | 'patch';
  columns: { key: string; label: string; render?: (val: any, item: any) => any }[];
  fields: FieldDef[];
}

export default function GenericCrud({ title, endpoint, updateMethod = 'put', columns, fields }: GenericCrudProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    setSuccessMsg('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreateNew = () => {
    setEditingItem('NEW');
    setFormData({});
    setError('');
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setError('');
  };

  const handleDelete = async (id: any) => {
    if (!confirm(`Tem certeza que deseja remover este ${title.slice(0, -1)}?`)) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      showSuccess('Removido com sucesso!');
      fetchItems();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao deletar';
      alert(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Reconstrói o payload enviando SOMENTE os campos mapeados na configuração 'fields'
      // Isso evita enviar relations povoadas pelo banco (ex: "profile: {}") que falham na validação do NestJS
      const payload: any = {};

      fields.forEach((f) => {
        let value = formData[f.name];

        // Se o valor estiver vazio e não for obrigatório, não precisa enviar
        if (value === '' || value === undefined) {
          if (f.type === 'password') return; // ignora senhas vazias
          if (!f.required) return; // ignora campos opcionais vazios
        }

        if (f.type === 'number' && value !== undefined && value !== '') {
          value = Number(value);
        }

        payload[f.name] = value;
      });

      if (editingItem === 'NEW') {
        delete payload.id;
        await api.post(endpoint, payload);
        showSuccess('Criado com sucesso!');
      } else {
        const id = editingItem.id;
        delete payload.id;
        if (updateMethod === 'patch') {
          await api.patch(`${endpoint}/${id}`, payload);
        } else {
          await api.put(`${endpoint}/${id}`, payload);
        }
        showSuccess('Atualizado com sucesso!');
      }
      fetchItems();
      setEditingItem(null);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data?.error || `Erro ao salvar`;
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const renderField = (f: FieldDef) => {
    const commonClass = 'form-control bg-dark text-light border-secondary';
    const value = formData[f.name] ?? '';
    const onChange = (e: any) => setFormData({ ...formData, [f.name]: e.target.value });

    if (f.type === 'select') {
      return (
        <select className={commonClass} required={f.required} value={value} onChange={onChange}>
          <option value="">Selecione...</option>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }
    if (f.type === 'textarea') {
      return (
        <textarea
          className={commonClass}
          required={f.required}
          value={value}
          onChange={onChange}
          rows={3}
        />
      );
    }
    return (
      <input
        type={f.type}
        className={commonClass}
        required={f.required}
        value={value}
        onChange={onChange}
      />
    );
  };

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-header border-secondary d-flex justify-content-between align-items-center py-3">
        <h3 className="mb-0 text-warning">
          <i className="bi bi-gear-fill me-2"></i>Gerenciar {title}
        </h3>
        {!editingItem && (
          <button onClick={handleCreateNew} className="btn btn-warning fw-bold text-dark">
            <i className="bi bi-plus-circle me-1"></i> Criar Novo
          </button>
        )}
      </div>

      <div className="card-body">
        {successMsg && (
          <div className="alert alert-success alert-dismissible border-success bg-dark text-success mb-3" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
          </div>
        )}
        {error && (
          <div className="alert border-danger text-danger bg-dark mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {editingItem ? (
          <form onSubmit={handleSubmit} className="p-3 border border-secondary rounded bg-black">
            <h5 className="text-warning mb-4">
              <i className={`bi ${editingItem === 'NEW' ? 'bi-plus-circle' : 'bi-pencil'} me-2`}></i>
              {editingItem === 'NEW' ? 'Novo Registro' : 'Editar Registro'}
            </h5>
            <div className="row g-3">
              {fields.map((f) => (
                <div key={f.name} className={f.fullWidth ? 'col-12' : 'col-md-6'}>
                  <label className="form-label text-secondary small fw-semibold">{f.label}</label>
                  {renderField(f)}
                </div>
              ))}
            </div>
            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-warning text-dark fw-bold px-4">
                <i className="bi bi-check2 me-1"></i>Salvar
              </button>
              <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline-secondary">
                <i className="bi bi-x me-1"></i>Cancelar
              </button>
            </div>
          </form>
        ) : loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-secondary mt-3 small">Carregando {title}...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-inbox fs-1 d-block mb-3 opacity-50"></i>
            <p>Nenhum registro encontrado.</p>
            <button onClick={handleCreateNew} className="btn btn-outline-warning btn-sm">
              <i className="bi bi-plus me-1"></i>Criar o primeiro
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-bordered align-middle mb-0">
              <thead className="table-warning text-dark">
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                  <th style={{ width: '120px' }} className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="badge bg-secondary" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                        {typeof item.id === 'string' && item.id.length > 8 ? `${item.id.slice(0, 8)}…` : item.id}
                      </span>
                    </td>
                    {columns.map((c) => (
                      <td key={c.key}>{c.render ? c.render(item[c.key], item) : String(item[c.key] ?? '-')}</td>
                    ))}
                    <td className="text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-sm btn-outline-warning me-1"
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Excluir"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-secondary small mt-2">
              {items.length} registro{items.length !== 1 ? 's' : ''} encontrado{items.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
