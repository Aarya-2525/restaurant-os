export const API_BASE_URL = 'http://192.168.29.121:8000'; // Change YOUR_LAPTOP_IP to your laptop's local IP address

// Helper to get tokens
const getAccessToken = () => localStorage.getItem('adminToken');
const getRefreshToken = () => localStorage.getItem('adminRefreshToken');

// Helper to set tokens
const setTokens = (access, refresh) => {
    localStorage.setItem('adminToken', access);
    if (refresh) localStorage.setItem('adminRefreshToken', refresh);
};

// Helper to clear tokens
const clearTokens = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
};

// Refresh Token Function
const refreshAccessToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('No refresh token available');

    const response = await fetch(`${API_BASE_URL}/admin/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
        throw new Error('Refresh failed');
    }

    const data = await response.json();
    setTokens(data.access, data.refresh); // Update tokens
    return data.access;
};

// Authenticated Fetch Wrapper
const fetchWithAuth = async (url, options = {}) => {
    let token = getAccessToken();

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

    // If body is not FormData, set Content-Type to application/json
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        headers,
    };

    let response = await fetch(url, config);

    // Handle 401 Unauthorized (Token Expired)
    if (response.status === 401) {
        try {
            token = await refreshAccessToken();

            // Retry original request with new token
            config.headers['Authorization'] = `Bearer ${token}`;
            response = await fetch(url, config);
        } catch (err) {
            // Refresh failed, logout
            clearTokens();
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
};

// --- Public APIs ---

export const fetchMenu = async (restaurantId) => {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/menu/`);
    if (!response.ok) {
        throw new Error('Failed to fetch menu');
    }
    return response.json();
};

export const placeOrder = async (restaurantId, orderData) => {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/orders/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.detail || JSON.stringify(errorData) || 'Failed to place order';
        throw new Error(errorMessage);
    }
    return response.json();
};

export const fetchOrderStatus = async (restaurantId, orderId) => {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/orders/${orderId}/`);
    if (!response.ok) {
        throw new Error('Failed to fetch order status');
    }
    return response.json();
};

export const fetchRestaurantSettings = async () => {
    // Public endpoint, no auth needed for GET
    const response = await fetch(`${API_BASE_URL}/admin/settings/`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
};

export const updateRestaurantSettings = async (settings) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/settings/`, {
        method: 'PUT',
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        try {
            const errorData = await response.json();
            const errorMessage = errorData.detail || JSON.stringify(errorData) || 'Failed to update settings';
            throw new Error(errorMessage);
        } catch (e) {
            throw new Error(`Failed to update settings: ${response.status} ${response.statusText}`);
        }
    }
    return response.json();
};

export const fetchTables = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/tables/`);
    if (!response.ok) throw new Error('Failed to fetch tables');
    return response.json();
};

export const addTable = async (number) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/tables/`, {
        method: 'POST',
        body: JSON.stringify({ number }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.detail || 'Failed to add table';
        throw new Error(errorMessage);
    }
    return response.json();
};

export const deleteTable = async (tableId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/tables/${tableId}/`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete table');
    return true;
};

// --- Admin APIs ---

export const loginAdmin = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/admin/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    setTokens(data.access, data.refresh);
    return data;
};

export const fetchAdminOrders = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/orders/`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
};

export const updateOrderStatus = async (token, orderId, status) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/orders/${orderId}/`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
};

export const clearOrders = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/orders/`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear orders');
    return response.json();
};

export const addMenuItem = async (token, itemData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/menu/`, {
        method: 'POST',
        body: itemData instanceof FormData ? itemData : JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to add menu item');
    return response.json();
};

export const uploadMenuCSV = async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetchWithAuth(`${API_BASE_URL}/admin/menu/csv-upload/`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload CSV');
    return response.json();
};

export const updateMenuItem = async (token, itemId, itemData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/menu/${itemId}/`, {
        method: 'PATCH',
        body: itemData instanceof FormData ? itemData : JSON.stringify(itemData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || JSON.stringify(errorData) || 'Failed to update menu item';
        throw new Error(errorMessage);
    }
    return response.json();
};
