import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Clients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setLimit] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

        if (!token) {
          setError("Unauthorized: No token found.");
          setLoading(false);
          return;
        }

        const params = {
          page,
          limit,
          startTime,
          endTime,
          sortBy,
        sortOrder,
        };

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admins/getAllUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
            params, // Attach query parameters to the GET request
          }
        );

        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized: Invalid or expired token.");
        } else {
          setError("Failed to load users.");
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, startTime, endTime, sortBy, sortOrder]); // Re-fetch when these state variables change

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(); // Format date to readable string
  };
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle the sort order when clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set the sort field and default to 'asc' order
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };

  const handleTimeFilter = () => {
    setPage(1); // Reset to the first page when filters are applied
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>

      {/* Time Filter Section */}
      <div className="mb-4">
        <input
          type="date"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
        <button
          onClick={handleTimeFilter}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Apply Time Filter
        </button>
      </div>

      {/* Pagination and Results per Page Section */}
      <div className="mb-4">
        <select
          onChange={handleLimitChange}
          value={limit}
          className="p-2 border rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          
        </select>
        <div className="mt-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Previous
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded ml-2"
          >
            Next
          </button>
        </div>
      </div>

      {/* Display Total Users */}
      <div className="mb-4 text-gray-700">
        Total Users: {totalUsers}
      </div>

      {/* Table displaying users */}
      <table className="min-w-full bg-white border border-gray-200 shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Avatar</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Created At
            <button
      onClick={() => handleSort("createdAt")}
      className="ml-2 text-sm text-blue-600"
    >
      
      <FontAwesomeIcon
        icon={sortBy === "createdAt" && sortOrder === "asc" ? faArrowUp : faArrowDown}
        className="text-blue-600"
      />
    </button>
            </th>
            <th className="px-4 py-2 text-left">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="px-4 py-2">{user.userName}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.phoneNumber || "N/A"}</td>
              <td className="px-4 py-2 capitalize">{user.role}</td>
              <td className="px-4 py-2">{formatDateTime(user.createdAt)}</td>
              <td className="px-4 py-2">{formatDateTime(user.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
