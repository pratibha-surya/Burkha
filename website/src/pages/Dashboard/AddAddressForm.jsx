// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { addAddress } from '../../features/address/addressSlice';
// import { FiPlus } from 'react-icons/fi';
// // import { fetchCities } from "../../features/city/citiesSlice";


// const AddAddressForm = () => {
//     const dispatch = useDispatch();
//     const [showForm, setShowForm] = useState(false); // State to toggle form visibility

//     const [formData, setFormData] = useState({
//         name: '',
//         number: '',
//         locality: '',
//         pincode: '',
//         address: '',
//         city: '',
//         landmark: '',
//         addressType: 'home',
//         userId: '',
//     });

//     // const { cities, status, error } = useSelector((state) => state.cities);

//     // useEffect(() => {
//     //     dispatch(fetchCities());
//     // }, [dispatch]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(addAddress(formData));
//         setShowForm(false); // Hide form after submission
//     };

//     return (
//         <div className=" items-center justify-center bg-gray-50 px-4 py-8">
//             {!showForm ? (
//                 // Add Address Button
//                 <button
//                     className="flex items-center bg-primary text-white py-2 px-4 rounded-md shadow-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
//                     onClick={() => setShowForm(true)}
//                 >
//                     <FiPlus className="mr-2" />
//                     Add Address
//                 </button>
//             ) : (
//                 // Address Form
//                 <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
//                     <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Address</h1>
//                     <form className="space-y-4" onSubmit={handleSubmit}>
//                         {/* Name */}
//                         <div>
//                             <label className="block text-gray-600 font-medium mb-1" htmlFor="name">
//                                 Full Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 value={formData.name}
//                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                 required
//                                 placeholder="Enter your full name"
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                         </div>
//                         {/* Number */}
//                         <div>
//                             <label className="block  text-gray-600 font-medium mb-1" htmlFor="number">
//                                 Phone Number
//                             </label>
//                             <input
//                                 type="text"
//                                 id="number"
//                                 value={formData.number}
//                                 onChange={(e) => setFormData({ ...formData, number: e.target.value })}
//                                 required
//                                 placeholder="Enter your phone number"
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                         </div>
//                         {/* Locality */}
//                         <div>
//                             <label className="block text-gray-600 font-medium mb-1" htmlFor="locality">
//                                 Locality
//                             </label>
//                             <input
//                                 type="text"
//                                 id="locality"
//                                 value={formData.locality}
//                                 onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
//                                 required
//                                 placeholder="Enter your locality"
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                         </div>
//                         {/* Pincode */}
//                         <div>
//                             <label className="block text-gray-600 font-medium mb-1" htmlFor="pincode">
//                                 Pincode
//                             </label>
//                             <input
//                                 type="text"
//                                 id="pincode"
//                                 value={formData.pincode}
//                                 onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//                                 required
//                                 placeholder="Enter your pincode"
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                         </div>
//                         {/* Address */}
//                         <div>
//                             <label className="block text-gray-600 font-medium mb-1" htmlFor="address">
//                                 Address
//                             </label>
//                             <textarea
//                                 id="address"
//                                 value={formData.address}
//                                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                                 required
//                                 placeholder="Enter your address (area or street)"
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//                             />
//                         </div>
//                         {/* City */}
//                         <div>
//                             <label className="block text-gray-600 font-medium mb-1" htmlFor="city">
//                                 City
//                             </label>
//                             <input
//                                 type="text"
//                                 id="city"
//                                 value={formData.city}
//                                 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                                 required
//                                 placeholder="Enter your city"
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                         </div>
//                         {/* Landmark */}
//                         <div>
//                             <label className="block text-gray-600 font-medium mb-1" htmlFor="landmark">
//                                 Landmark (Optional)
//                             </label>
//                             <input
//                                 type="text"
//                                 id="landmark"
//                                 value={formData.landmark}
//                                 onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
//                                 placeholder="Enter landmark (optional)"
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                         </div>
//                         {/* Address Type */}
//                         <div>
//                             <label className="block text-gray-600 font-medium mb-1" htmlFor="addressType">
//                                 Address Type
//                             </label>
//                             <select
//                                 id="addressType"
//                                 value={formData.addressType}
//                                 onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                             >
//                                 <option value="home">Home</option>
//                                 <option value="work">Work</option>
//                             </select>
//                         </div>
//                         {/* Submit Button */}
//                         <div className="flex justify-between">
//                             <button
//                                 type="button"
//                                 onClick={() => setShowForm(false)}
//                                 className="w-1/4 bg-gray-300 text-gray-700 py-2 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="w-3/4 bg-primary text-white py-2 rounded-md shadow-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
//                             >
//                                 Save Address
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AddAddressForm;



import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAddress } from '../features/address/addressSlice';
import { FiPlus } from 'react-icons/fi';

const AddAddressForm = () => {
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        locality: '',
        pincode: '',
        address: '',
        city: '',
        landmark: '',
        addressType: 'home',
        userId: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addAddress(formData));
        setShowForm(false);
    };

    return (
        <div className="container py-4">
            {!showForm ? (
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => setShowForm(true)}
                >
                    <FiPlus className="me-2" />
                    Add Address
                </button>
            ) : (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h1 className="h4 mb-4">Add New Address</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="number" className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    id="number"
                                    className="form-control"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="locality" className="form-label">Locality</label>
                                <input
                                    type="text"
                                    id="locality"
                                    className="form-control"
                                    value={formData.locality}
                                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                                    placeholder="Enter your locality"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="pincode" className="form-label">Pincode</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    className="form-control"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    placeholder="Enter your pincode"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea
                                    id="address"
                                    className="form-control"
                                    rows="2"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter your address (area or street)"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="city" className="form-label">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="landmark" className="form-label">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    id="landmark"
                                    className="form-control"
                                    value={formData.landmark}
                                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                    placeholder="Enter landmark (optional)"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="addressType" className="form-label">Address Type</label>
                                <select
                                    id="addressType"
                                    className="form-select"
                                    value={formData.addressType}
                                    onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary w-50">
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAddressForm;
