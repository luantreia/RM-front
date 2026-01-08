const API_URL = '/api';

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Algo salió mal');
  return data;
};

export const api = {
  auth: {
    login: (body) => fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json()),
    
    register: (body) => fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json())
  },
  
  ejercicios: {
    getAll: () => fetchWithAuth('/ejercicios'),
    create: (nombre) => fetchWithAuth('/ejercicios', {
      method: 'POST',
      body: JSON.stringify({ nombre })
    }),
    update: (id, nombre) => fetchWithAuth(`/ejercicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombre })
    }),
    delete: (id) => fetchWithAuth(`/ejercicios/${id}`, {
      method: 'DELETE'
    })
  },
  
  registros: {
    getAll: (ejercicioId) => fetchWithAuth(`/registros?ejercicioId=${ejercicioId || ''}`),
    getRMActual: (ejercicioId) => fetchWithAuth(`/registros/actual/${ejercicioId}`),
    create: (data) => fetchWithAuth('/registros', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => fetchWithAuth(`/registros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => fetchWithAuth(`/registros/${id}`, {
      method: 'DELETE'
    })
  }
};
