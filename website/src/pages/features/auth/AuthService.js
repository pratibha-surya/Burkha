import apiClient from '../api/apiClient'; // Adjust the API client path if necessary

export const Login = async (data ) =>{
    const response = await apiClient.post('/auth/login', data);
        console.log(response.data);
        return response.data;

}

export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/api/v1/admin/delete/${id}`);
    return response.data;
}


export const Register = async (data) => {
    const response = await apiClient.post('/api/v1/admin/register', data);
    return response.data;
}

export const Logout = async () => {
    const response = await apiClient.get('/api/v1/admin/logout');
    return response.data;
}

export const update = async (data) => {
    const response = await apiClient.put('/api/v1/admin/update', data);
    return response.data;
}

export const password = async (data) => {
    const response = await apiClient.put('/api/v1/admin/change-password', data);
    return response.data;
}

