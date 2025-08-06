import { useQuery } from 'react-query';
import { vehiclesAPI } from '../services/api';
import { TruckIcon, EyeIcon, CurrencyEuroIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { data: vehiclesData, isLoading } = useQuery(
    'dashboard-vehicles',
    () => vehiclesAPI.getAll(),
    {
      select: (response) => response.data
    }
  );

  const vehicles = vehiclesData?.data || [];
  
  // Calculate stats
  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    pending: vehicles.filter(v => v.status === 'pending').length,
    sold: vehicles.filter(v => v.status === 'sold').length,
    totalValue: vehicles
      .filter(v => v.status === 'active')
      .reduce((sum, v) => sum + parseFloat(v.price || 0), 0)
  };

  const recentVehicles = vehicles
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your luxury car inventory
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Vehicles
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Listings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.active}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sold This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.sold}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyEuroIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Inventory Value
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    €{stats.totalValue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Vehicles
          </h3>
          
          {recentVehicles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No vehicles added yet. <a href="/vehicles/new" className="text-primary-600 hover:text-primary-500">Add your first vehicle</a>
            </p>
          ) : (
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {recentVehicles.map((vehicle) => (
                  <li key={vehicle.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {vehicle.featuredImage ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={`http://localhost:5000${vehicle.featuredImage}`}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <TruckIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </p>
                        <p className="text-sm text-gray-500">
                          €{parseFloat(vehicle.price).toLocaleString()} • {vehicle.mileage?.toLocaleString()} km
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vehicle.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : vehicle.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;