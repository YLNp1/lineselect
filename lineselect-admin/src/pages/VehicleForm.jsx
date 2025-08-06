import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { vehiclesAPI, mediaAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import AudioUpload from '../components/AudioUpload';
import toast from 'react-hot-toast';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [vehicleImages, setVehicleImages] = useState([]);
  const [vehicleAudio, setVehicleAudio] = useState([]);
  const [savedVehicleId, setSavedVehicleId] = useState(id);

  const { data: vehicle, isLoading } = useQuery(
    ['vehicle', id],
    () => vehiclesAPI.getById(id),
    {
      enabled: isEdit,
      select: (response) => response.data.data
    }
  );

  const { data: existingMedia } = useQuery(
    ['media', id],
    () => mediaAPI.getByVehicle(id),
    {
      enabled: isEdit && !!id,
      select: (response) => response.data.data,
      onSuccess: (media) => {
        const images = media.filter(item => item.type === 'image');
        const audio = media.filter(item => item.type === 'audio');
        setVehicleImages(images);
        setVehicleAudio(audio);
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    if (vehicle && isEdit) {
      // Populate form with vehicle data
      Object.keys(vehicle).forEach(key => {
        if (key === 'features' && Array.isArray(vehicle[key])) {
          setValue(key, vehicle[key].join(', '));
        } else {
          setValue(key, vehicle[key]);
        }
      });
    }
  }, [vehicle, isEdit, setValue]);

  const createVehicle = useMutation(vehiclesAPI.create, {
    onSuccess: (response) => {
      const newVehicleId = response.data.data.id;
      setSavedVehicleId(newVehicleId);
      queryClient.invalidateQueries('vehicles');
      toast.success('Vehicle created successfully! You can now upload images.');
      // Don't navigate immediately, let user upload images first
    }
  });

  const updateVehicle = useMutation(
    (data) => vehiclesAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
        queryClient.invalidateQueries(['vehicle', id]);
        toast.success('Vehicle updated successfully');
        navigate('/vehicles');
      }
    }
  );

  const onSubmit = (data) => {
    // Process features string to array
    if (data.features) {
      data.features = data.features.split(',').map(f => f.trim()).filter(f => f);
    }

    if (isEdit) {
      updateVehicle.mutate(data);
    } else {
      createVehicle.mutate(data);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit ? 'Update vehicle information' : 'Add a luxury vehicle to your inventory'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand *</label>
              <input
                type="text"
                {...register('brand', { required: 'Brand is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Ferrari, Lamborghini, Porsche..."
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Model *</label>
              <input
                type="text"
                {...register('model', { required: 'Model is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="488 GTB, Huracán, 911 Turbo..."
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year *</label>
              <input
                type="number"
                {...register('year', { 
                  required: 'Year is required',
                  min: { value: 1900, message: 'Year must be after 1900' },
                  max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the far future' }
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (€) *</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="250000"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mileage (km) *</label>
              <input
                type="number"
                {...register('mileage', { 
                  required: 'Mileage is required',
                  min: { value: 0, message: 'Mileage must be positive' }
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="15000"
              />
              {errors.mileage && (
                <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Technical Details</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Engine Type</label>
              <input
                type="text"
                {...register('engineType')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="V8, V12, Hybrid..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Power</label>
              <input
                type="text"
                {...register('power')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="650 HP, 720 PS..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Transmission</label>
              <input
                type="text"
                {...register('transmission')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="7-Speed DCT, Manual..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Exterior Color</label>
              <input
                type="text"
                {...register('exteriorColor')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Rosso Corsa, Nero Daytona..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Interior Color</label>
              <input
                type="text"
                {...register('interiorColor')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Black Leather, Beige Alcantara..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">360° View & Audio</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">360° View URL (Impel)</label>
              <input
                type="url"
                {...register('view360Url')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="https://impel.app/embed/your-360-view-id"
              />
              <p className="mt-1 text-sm text-gray-500">
                Embed URL from Impel 360° viewer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Engine Sound URL</label>
              <input
                type="url"
                {...register('engineSoundUrl')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="https://example.com/engine-sound.mp3"
              />
              <p className="mt-1 text-sm text-gray-500">
                Direct link to engine sound file (MP3, WAV)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Description & Features</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                {...register('description')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Detailed description of this exceptional vehicle..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Features</label>
              <textarea
                rows={3}
                {...register('features')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Carbon fiber body, Sport suspension, Premium sound system (separate with commas)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate features with commas
              </p>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Vehicle Images</h2>
          <ImageUpload 
            vehicleId={savedVehicleId}
            images={vehicleImages}
            onImagesChange={setVehicleImages}
          />
          {!savedVehicleId && (
            <p className="text-sm text-gray-500 mt-2">
              Save the vehicle first to upload images
            </p>
          )}
        </div>

        {/* Audio Upload Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Engine Sounds</h2>
          <AudioUpload 
            vehicleId={savedVehicleId}
            audioFiles={vehicleAudio}
            onAudioChange={setVehicleAudio}
          />
          {!savedVehicleId && (
            <p className="text-sm text-gray-500 mt-2">
              Save the vehicle first to upload audio files
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          <div>
            {savedVehicleId && !isEdit && (
              <button
                type="button"
                onClick={() => navigate('/vehicles')}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Done - View All Vehicles
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createVehicle.isLoading || updateVehicle.isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {createVehicle.isLoading || updateVehicle.isLoading 
                ? 'Saving...' 
                : isEdit 
                  ? 'Update Vehicle' 
                  : 'Create Vehicle'
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;