
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, deleteAddress, updateAddress } from '../../features/address/addressSlice';

const AddressList = ({ userId }) => {
    const dispatch = useDispatch();
    const { addresses, loading, error } = useSelector((state) => state.address);
    

    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        dispatch(fetchAddresses(userId));
    }, [dispatch, userId]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            dispatch(deleteAddress(id));
        }
    };

    const handleEditClick = (address) => {
        setIsEditing(true);
        setCurrentAddress(address);
        setFormData({ ...address });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = () => {
        dispatch(updateAddress({ id: currentAddress._id, ...formData }));
        setIsEditing(false);
        setCurrentAddress(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentAddress(null);
    };

    if (loading) return <p className="text-center text-muted">Loading...</p>;
    if (error) return <p className="text-center text-danger">Error: {error}</p>;

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4 h4">Address List</h1>
            <div className="row g-4">
                {addresses.map((address) => (
                    <div key={address._id} className="col-sm-6 col-lg-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <p><strong>Name:</strong> {address.name}</p>
                                <p><strong>Phone:</strong> {address.number}</p>
                                <p><strong>Locality:</strong> {address.locality}</p>
                                <p><strong>Address:</strong> {address.address}</p>
                                <p><strong>City:</strong> {address.city}</p>
                                <p><strong>Pincode:</strong> {address.pincode}</p>
                                <p><strong>Landmark:</strong> {address.landmark}</p>
                                <p><strong>Type:</strong> {address.addressType}</p>
                                <p><strong>Created:</strong> {new Date(address.createdAt).toLocaleDateString()}</p>
                                <p><strong>Updated:</strong> {new Date(address.updatedAt).toLocaleDateString()}</p>
                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        onClick={() => handleEditClick(address)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address._id)}
                                        className="btn btn-outline-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Address</h5>
                                <button type="button" className="btn-close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleFormChange}
                                        placeholder="Name"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="number"
                                        value={formData.number || ''}
                                        onChange={handleFormChange}
                                        placeholder="Phone Number"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="locality"
                                        value={formData.locality || ''}
                                        onChange={handleFormChange}
                                        placeholder="Locality"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleFormChange}
                                        placeholder="Address"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleFormChange}
                                        placeholder="City"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode || ''}
                                        onChange={handleFormChange}
                                        placeholder="Pincode"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark || ''}
                                        onChange={handleFormChange}
                                        placeholder="Landmark"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={handleUpdate} className="btn btn-success">
                                    Save
                                </button>
                                <button onClick={handleCancel} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressList;
