const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        throw new Error(data?.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const authApi = {
  adminLogin: (userName, password) => request('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ userName, password }),
  }),
  clientLogin: (userName, password) => request('/auth/client/login', {
    method: 'POST',
    body: JSON.stringify({ userName, password }),
  }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  adminRegister: (data) => request('/auth/admin/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
};

export const adminApi = {
  getClients: () => request('/admin/clients'),
  createClient: (data) => request('/admin/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateClient: (id, data) => request(`/admin/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteClient: (id, password) => request(`/admin/clients/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  }),
  toggleClientAccess: (id) => request(`/admin/clients/${id}/toggle-access`, {
    method: 'PUT'
  }),
  getAllSubmissions: () => request('/admin/submissions'),
  getClientSubmissions: (clientId) => request(`/admin/submissions/client/${clientId}`),
  deleteSubmission: (id) => request(`/admin/submissions/${id}`, {
    method: 'DELETE'
  }),
};

export const clientApi = {
  getMySubmissions: () => request('/forms/my-submissions'),
};

export const publicApi = {
    submitForm: (clientId, data) => request(`/forms/submit/${clientId}`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
