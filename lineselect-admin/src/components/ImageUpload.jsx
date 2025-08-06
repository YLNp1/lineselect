import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from 'react-query';
import { mediaAPI } from '../services/api';
import { PhotoIcon, XMarkIcon, SpeakerWaveIcon, PlayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ImageUpload = ({ vehicleId, images = [], onImagesChange }) => {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadImages = useMutation(
    (formData) => mediaAPI.upload(vehicleId, formData),
    {
      onSuccess: (response) => {
        const newImages = response.data.data.filter(item => item.type === 'image');
        onImagesChange([...images, ...newImages]);
        queryClient.invalidateQueries(['media', vehicleId]);
        toast.success(`${newImages.length} images uploaded successfully`);
      },
      onError: (error) => {
        toast.error('Failed to upload images');
        console.error('Upload error:', error);
      },
      onSettled: () => {
        setUploading(false);
      }
    }
  );

  const deleteImage = useMutation(
    (imageId) => mediaAPI.delete(imageId),
    {
      onSuccess: (_, imageId) => {
        const updatedImages = images.filter(img => img.id !== imageId);
        onImagesChange(updatedImages);
        queryClient.invalidateQueries(['media', vehicleId]);
        toast.success('Image deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete image');
      }
    }
  );

  const setMainImage = useMutation(
    (imageId) => mediaAPI.setMain(imageId),
    {
      onSuccess: (_, imageId) => {
        const updatedImages = images.map(img => ({
          ...img,
          isMain: img.id === imageId
        }));
        onImagesChange(updatedImages);
        queryClient.invalidateQueries(['media', vehicleId]);
        toast.success('Main image updated');
      },
      onError: () => {
        toast.error('Failed to set main image');
      }
    }
  );

  const onDrop = useCallback((acceptedFiles) => {
    if (!vehicleId) {
      toast.error('Please save the vehicle first before uploading images');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    acceptedFiles.forEach((file) => {
      formData.append('images', file);
    });

    uploadImages.mutate(formData);
  }, [vehicleId, uploadImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    multiple: true,
    disabled: uploading
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Images
        </label>
        
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          
          {uploading ? (
            <div className="mt-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the images here...'
                  : 'Drag & drop images here, or click to select files'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, WebP up to 10MB each
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={`http://localhost:5000${image.thumbnailUrl || image.url}`}
                    alt={image.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  {!image.isMain && (
                    <button
                      onClick={() => setMainImage.mutate(image.id)}
                      className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                      disabled={setMainImage.isLoading}
                    >
                      Set Main
                    </button>
                  )}
                  <button
                    onClick={() => deleteImage.mutate(image.id)}
                    className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                    disabled={deleteImage.isLoading}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Main Image Badge */}
                {image.isMain && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;