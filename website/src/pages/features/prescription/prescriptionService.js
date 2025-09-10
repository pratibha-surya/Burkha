import apiClient from '../../api/apiClient';

export const UploadPrescription = async (data) => {
    console.log(data);
    
    const formData = new FormData();
    formData.append('message', data.message);
    formData.append('city', data.city);
    formData.append('file', data.file);
    console.log(formData);
    

    const response = await apiClient.post('/api/v1/prescription/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(response.data);
    
    return response.data;
};
