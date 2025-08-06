import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { vehiclesAPI } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Vehicles = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: vehiclesData, isLoading } = useQuery(
    ['vehicles', statusFilter],
    () => vehiclesAPI.getAll(statusFilter !== 'all' ? { status: statusFilter } : {}),
    {
      select: (response) => response.data
    }
  );

  const deleteVehicle = useMutation(vehiclesAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      toast.success('Vehicle deleted successfully');
    }
  });

  const updateStatus = useMutation(vehiclesAPI.updateStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      toast.success('Status updated successfully');
    }
  });

  const vehicles = vehiclesData?.data || [];

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteVehicle.mutate(id);
    }
  };

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your luxury car inventory
          </p>
        </div>
        <Link
          to="/vehicles/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Vehicle
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {vehicles.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first luxury vehicle.</p>
            <Link
              to="/vehicles/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Vehicle
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {(() => {
                          // Find the main image from media array or use featuredImage
                          let imageUrl = vehicle.featuredImage;
                          if (vehicle.media && vehicle.media.length > 0) {
                            const mainImage = vehicle.media.find(m => m.type === 'image' && m.isMain);
                            if (mainImage) {
                              imageUrl = mainImage.url;
                            } else {
                              // If no main image, use the first image
                              const firstImage = vehicle.media.find(m => m.type === 'image');
                              if (firstImage) {
                                imageUrl = firstImage.url;
                              }
                            }
                          }
                          
                          return imageUrl ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={`http://localhost:5000${imageUrl}`}
                              alt={`${vehicle.brand} ${vehicle.model}`}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.brand} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.year} • {vehicle.engineType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{parseFloat(vehicle.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.mileage?.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={vehicle.status}
                      onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                      className={`text-sm rounded-full px-2 py-1 font-medium border-0 focus:ring-2 focus:ring-offset-2 ${
                        vehicle.status === 'active'
                          ? 'bg-green-100 text-green-800 focus:ring-green-500'
                          : vehicle.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'
                          : 'bg-gray-100 text-gray-800 focus:ring-gray-500'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {vehicle.viewCount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/vehicles/${vehicle.id}/edit`}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="Edit Vehicle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Vehicle"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Vehicles;