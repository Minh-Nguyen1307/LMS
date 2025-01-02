import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Edit() {
  const [userData, setUserData] = useState({
    avatar: '',
    phoneNumber: '',
    
  });
  const [userId, setUserId] = useState(''); // Giả định bạn lấy userId từ đâu đó
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
    setUserData({
      email: storedUserData.email || '',
      avatar: storedUserData.avatar || '',
      phoneNumber: storedUserData.phoneNumber || '',
      password: '',
    });
    setUserId(storedUserData.id);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/getUserById/${userId}`,
        {
          avatar: userData.avatar,
          phoneNumber: userData.phoneNumber,
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Profile updated successfully!');
      localStorage.setItem(
        'userDetails',
        JSON.stringify({
          ...JSON.parse(localStorage.getItem('userDetails')),
          avatar: userData.avatar,
          phoneNumber: userData.phoneNumber,
        })
      );
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-800 text-white p-6">
          <h2 className="text-3xl font-bold">Edit Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <table className="w-full table-auto border-collapse">
            <tbody>
             
              <tr>
                <td className="p-4 font-semibold text-gray-700">Avatar URL</td>
                <td className="p-4">
                  <input
                    type="text"
                    name="avatar"
                    value={userData.avatar}
                    onChange={handleChange}
                    className="border px-4 py-2 w-full rounded"
                  />
                </td>
              </tr>

              {/* Số điện thoại */}
              <tr>
                <td className="p-4 font-semibold text-gray-700">Phone Number</td>
                <td className="p-4">
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleChange}
                    className="border px-4 py-2 w-full rounded"
                  />
                </td>
              </tr>

              {/* Đổi mật khẩu */}
             
            </tbody>
          </table>

          <div className="mt-4">
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
