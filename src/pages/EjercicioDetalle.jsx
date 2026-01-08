import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/api';
import RMChart from '../components/RMChart';

const EjercicioDetalle = () => {
  const { id } = useParams();
  const [ejercicio, setEjercicio] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState({ 
    peso: '', 
    reps: '', 
    formula: 'epley', 
    fecha: new Date().toISOString().split('T')[0] 
  });
  const [editingId, setEditingId] = useState(null);
  const [maxRM, setMaxRM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nombreEdicion, setNombreEdicion] = useState('');

  const loadData = async () => {
    try {
      const ejs = await api.ejercicios.getAll();
      const current = ejs.find(e => e._id === id);
      setEjercicio(current);

      const regs = await api.registros.getAll(id);
      setRegistros(regs);

      const actual = await api.registros.getRMActual(id);
      setMaxRM(actual);
      if (current) setNombreEdicion(current.nombre);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNombre = async (e) => {
    e.preventDefault();
    try {
      await api.ejercicios.update(id, nombreEdicion);
      setIsEditingName(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEjercicio = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este ejercicio y todos sus registros?')) return;
    try {
      await api.ejercicios.delete(id);
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.registros.update(editingId, {
          peso: Number(form.peso),
          reps: Number(form.reps),
          formula: form.formula,
          fecha: form.fecha
        });
        setEditingId(null);
      } else {
        await api.registros.create({
          ejercicioId: id,
          peso: Number(form.peso),
          reps: Number(form.reps),
          formula: form.formula,
          fecha: form.fecha
        });
      }
      setForm({ ...form, peso: '', reps: '' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (registro) => {
    setEditingId(registro._id);
    setForm({
      peso: registro.peso,
      reps: registro.reps,
      formula: registro.formula,
      fecha: new Date(registro.fecha).toISOString().split('T')[0]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (regId) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este registro?')) return;
    try {
      await api.registros.delete(regId);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ ...form, peso: '', reps: '' });
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20 min-h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a73e8]"></div>
    </div>
  );
  
  if (!ejercicio) return <div className="text-center py-24 text-[#5f6368] card">Ejercicio no encontrado.</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="mb-8">
        <Link to="/" className="text-[#1a73e8] inline-flex items-center gap-1.5 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors -ml-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al panel
        </Link>
      </nav>

      <header className="mb-12 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-grow">
          {isEditingName ? (
            <form onSubmit={handleUpdateNombre} className="flex items-center gap-2 mb-2">
              <input 
                type="text" 
                value={nombreEdicion} 
                onChange={(e) => setNombreEdicion(e.target.value)}
                className="text-[42px] font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none w-full max-w-xl"
                autoFocus
              />
              <button type="submit" className="text-green-600 p-2 hover:bg-green-50 rounded-full" title="Guardar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button type="button" onClick={() => setIsEditingName(false)} className="text-gray-400 p-2 hover:bg-gray-100 rounded-full" title="Cancelar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          ) : (
            <div className="group flex items-center gap-4 mb-2">
              <h1 className="text-[42px] font-bold text-gray-900 tracking-tight leading-tight">{ejercicio.nombre}</h1>
              <button 
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 p-2 text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-full transition-all"
                title="Editar nombre"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
          <p className="text-lg text-[#5f6368]">Análisis de rendimiento y evolución histórica.</p>
        </div>
        
        {!isEditingName && (
          <button 
            onClick={handleDeleteEjercicio}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar ejercicio
          </button>
        )}
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        {/* Formulario Lateral */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="card bg-white h-full border-t-4 border-t-[#1a73e8]">
            <h3 className="text-xl font-semibold text-gray-900 mb-8 px-1">
              {editingId ? 'Editar serie' : 'Registrar serie'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">Peso utilizado (kg)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={form.peso} 
                  onChange={e => setForm({...form, peso: e.target.value})} 
                  className="input-field py-3 text-lg"
                  placeholder="0.0" 
                  required 
                />
              </div>
              
              <div>
                <label className="label">Repeticiones logradas</label>
                <input 
                  type="number" 
                  value={form.reps} 
                  onChange={e => setForm({...form, reps: e.target.value})} 
                  className="input-field py-3 text-lg"
                  placeholder="1"
                  required 
                />
              </div>
              
              <div>
                <label className="label">Fórmula de estimación</label>
                <select 
                  value={form.formula} 
                  onChange={e => setForm({...form, formula: e.target.value})}
                  className="input-field bg-white py-3"
                >
                  <option value="epley">Epley (Estándar)</option>
                  <option value="brzycki">Brzycki (Fuerza)</option>
                  <option value="lombardi">Lombardi (Resistencia)</option>
                </select>
              </div>

              <div>
                <label className="label">Fecha del entrenamiento</label>
                <input 
                  type="date" 
                  value={form.fecha} 
                  onChange={e => setForm({...form, fecha: e.target.value})} 
                  className="input-field py-3"
                />
              </div>
              
              <button type="submit" className="btn-primary w-full py-4 text-lg font-semibold mt-4 shadow-google-sm hover:shadow-google-md active:translate-y-0.5 transition-all">
                {editingId ? 'Actualizar registro' : 'Guardar levantamiento'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancelar edición
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Info y Gráfico */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {maxRM && (
            <div className="card bg-gradient-to-br from-blue-600 to-blue-800 border-none flex items-center justify-between p-10 text-white shadow-google-md overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-xs font-bold text-blue-100 uppercase tracking-[0.2em] mb-3 opacity-90">MEJOR RM ESTIMADO</p>
                <p className="text-7xl font-black tracking-tighter">{maxRM.rmEstimado.toFixed(1)} <span className="text-2xl font-light opacity-80 ml-1">kg</span></p>
              </div>
              <div className="relative z-10 hidden sm:block">
                 <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                   </svg>
                 </div>
              </div>
              {/* Decoración fondo */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          )}
          
          <div className="card flex-grow overflow-hidden bg-white">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-gray-900">Curva de progresión</h3>
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-[#1a73e8] rounded-full"></span>
                  <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider">1RM Estimado por serie</span>
                </div>
             </div>
             {registros.length > 0 ? (
                <div className="h-[350px]">
                  <RMChart registros={registros} />
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-[#5f6368] bg-gray-50 rounded-xl border-dashed border-2">
                  <p className="font-medium">Sin datos suficientes</p>
                  <p className="text-sm">Agregá al menos un registro para visualizar el gráfico.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden !p-0 bg-white shadow-sm border-[#dadce0]">
        <div className="px-8 py-6 border-b border-[#dadce0] flex items-center justify-between bg-white">
          <h3 className="text-xl font-semibold text-gray-900">Historial de registros</h3>
          <span className="px-3 py-1 bg-gray-100 text-[#5f6368] text-xs font-bold rounded-full uppercase tracking-wider">{registros.length} entradas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#dadce0]">
                <th className="px-8 py-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-[0.1em]">Fecha</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-[0.1em]">Peso usado</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-[0.1em]">Reps</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-[0.1em]">Fórmula</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-[0.1em] text-right">Resultado RM</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#5f6368] uppercase tracking-[0.1em] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee]">
              {registros.map(r => (
                <tr key={r._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 text-sm text-gray-600 font-medium">{new Date(r.fecha).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-8 py-5 text-sm text-gray-900 font-bold">{r.peso} <span className="font-normal text-gray-400">kg</span></td>
                  <td className="px-8 py-5 text-sm text-gray-900">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">{r.reps} {r.reps === 1 ? 'rep' : 'reps'}</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-[#5f6368] capitalize font-medium">{r.formula}</td>
                  <td className="px-8 py-5 text-sm text-[#1a73e8] font-black text-right text-lg tracking-tighter">
                    {r.rmEstimado.toFixed(1)} <span className="text-xs font-medium ml-0.5">kg</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(r._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {registros.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-[#5f6368] italic border-none bg-gray-50/50">
                    Todavía no registraste entrenamientos para este ejercicio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EjercicioDetalle;
