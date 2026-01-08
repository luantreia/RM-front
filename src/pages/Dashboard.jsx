import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api';

const Dashboard = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [RMS, setRMS] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [nombreEdicion, setNombreEdicion] = useState('');

  const loadData = async () => {
    try {
      const data = await api.ejercicios.getAll();
      setEjercicios(data);
      
      const rms = {};
      for (const ej of data) {
        try {
          const res = await api.registros.getRMActual(ej._id);
          rms[ej._id] = res ? res.rmEstimado.toFixed(1) : '-';
        } catch (e) {
          rms[ej._id] = '-';
        }
      }
      setRMS(rms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nombreNuevo) return;
    try {
      await api.ejercicios.create(nombreNuevo);
      setNombreNuevo('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.ejercicios.update(editingId, nombreEdicion);
      setEditingId(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro? Se eliminarán todos los registros de este ejercicio.')) return;
    try {
      await api.ejercicios.delete(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20 min-h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a73e8]"></div>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[38px] font-semibold text-gray-900 mb-3 tracking-tight leading-tight">Panel de control</h1>
          <p className="text-lg text-[#5f6368] max-w-2xl">Seguí tu evolución de fuerza y gestioná tus levantamientos máximos estimados.</p>
        </div>
        
        <form onSubmit={handleCreate} className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Ej: Press de banca..." 
              value={nombreNuevo} 
              onChange={(e) => setNombreNuevo(e.target.value)} 
              className="input-field w-full md:w-72"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar
          </button>
        </form>
      </div>

      {ejercicios.length === 0 ? (
        <div className="card text-center py-24 bg-white border-dashed border-2 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Sin ejercicios todavía</h3>
          <p className="text-[#5f6368]">Comenzá agregando tu primer ejercicio en el formulario de arriba.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ejercicios.map(ej => (
            <div key={ej._id} className="relative group">
              {editingId === ej._id ? (
                <div className="card border-[#1a73e8] shadow-google-md">
                  <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <input 
                      type="text" 
                      value={nombreEdicion} 
                      onChange={(e) => setNombreEdicion(e.target.value)}
                      className="input-field w-full"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary flex-1 py-1 text-sm">Guardar</button>
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)}
                        className="btn-secondary flex-1 py-1 text-sm text-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <Link 
                    to={`/ejercicio/${ej._id}`}
                    className="card block hover:border-[#1a73e8] border hover:shadow-google-md transition-all duration-300 transform hover:-translate-y-1 h-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#1a73e8] transition-colors line-clamp-1 pr-16">{ej.nombre}</h3>
                      <div className="text-[#1a73e8] bg-blue-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-[11px] text-[#5f6368] uppercase tracking-widest font-bold mb-1">RM ESTIMADA ACTUAL</p>
                      <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {RMS[ej._id] || '-'} <span className="text-lg font-medium text-[#5f6368] ml-1">kg</span>
                      </p>
                    </div>
                  </Link>
                  
                  {/* Botones de acción rápidos */}
                  <div className="absolute top-4 right-14 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingId(ej._id);
                        setNombreEdicion(ej.nombre);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Editar nombre"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, ej._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar ejercicio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
