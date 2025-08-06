import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from 'react-query';
import { mediaAPI } from '../services/api';
import { SpeakerWaveIcon, XMarkIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AUDIO_CATEGORIES = {
  engine_start: {
    label: 'Engine Start',
    description: 'Motor opstarten geluid',
    icon: '🔥',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  engine_idle: {
    label: 'Engine Idle',
    description: 'Motor stationair draaien',
    icon: '⚙️',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  engine_rev: {
    label: 'Engine Rev',
    description: 'Motor toeren omhoog',
    icon: '🚀',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  engine_shutdown: {
    label: 'Engine Shutdown',
    description: 'Motor uitschakelen',
    icon: '⏹️',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  exhaust: {
    label: 'Exhaust Sound',
    description: 'Uitlaat geluid',
    icon: '💨',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  general: {
    label: 'General Audio',
    description: 'Algemeen audio',
    icon: '🔊',
    color: 'bg-green-100 text-green-800 border-green-200'
  }
};

const AudioUpload = ({ vehicleId, audioFiles = [], onAudioChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('engine_idle');
  const [uploading, setUploading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const queryClient = useQueryClient();

  const uploadAudio = useMutation(
    ({ formData, category }) => {
      // Add category to form data
      formData.append('audioCategory', category);
      return mediaAPI.upload(vehicleId, formData);
    },
    {
      onSuccess: (response) => {
        const newAudio = response.data.data.filter(item => item.type === 'audio');
        if (newAudio.length > 0) {
          onAudioChange([...audioFiles, ...newAudio]);
          toast.success(`${newAudio.length} audio files uploaded successfully`);
        }
        queryClient.invalidateQueries(['media', vehicleId]);
      },
      onError: (error) => {
        toast.error('Failed to upload audio');
        console.error('Upload error:', error);
      },
      onSettled: () => {
        setUploading(false);
      }
    }
  );

  const deleteAudio = useMutation(
    (audioId) => mediaAPI.delete(audioId),
    {
      onSuccess: (_, audioId) => {
        const updatedAudio = audioFiles.filter(audio => audio.id !== audioId);
        onAudioChange(updatedAudio);
        queryClient.invalidateQueries(['media', vehicleId]);
        toast.success('Audio deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete audio');
      }
    }
  );

  const onDrop = useCallback((acceptedFiles) => {
    if (!vehicleId) {
      toast.error('Please save the vehicle first before uploading audio');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    acceptedFiles.forEach((file) => {
      formData.append('audio', file);
    });

    uploadAudio.mutate({ formData, category: selectedCategory });
  }, [vehicleId, selectedCategory, uploadAudio]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav']
    },
    multiple: false,
    disabled: uploading
  });

  const handlePlayAudio = (audioId, audioUrl) => {
    if (playingAudio === audioId) {
      // Stop current audio
      const audioElement = document.getElementById(`audio-${audioId}`);
      audioElement.pause();
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (playingAudio) {
        const currentAudio = document.getElementById(`audio-${playingAudio}`);
        currentAudio?.pause();
      }
      
      // Play new audio
      const audioElement = document.getElementById(`audio-${audioId}`);
      audioElement.play();
      setPlayingAudio(audioId);
    }
  };

  // Group audio files by category
  const audioByCategory = audioFiles.reduce((acc, audio) => {
    const category = audio.audioCategory || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(audio);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Audio Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(AUDIO_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedCategory(key)}
              className={`p-3 text-left border rounded-lg transition-all ${
                selectedCategory === key
                  ? 'ring-2 ring-blue-500 ' + category.color
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <div className="font-medium text-sm">{category.label}</div>
                  <div className="text-xs text-gray-500">{category.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload {AUDIO_CATEGORIES[selectedCategory]?.label}
        </label>
        
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
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">{AUDIO_CATEGORIES[selectedCategory]?.icon}</span>
            <SpeakerWaveIcon className="h-8 w-8 text-gray-400 mb-2" />
          </div>
          
          {uploading ? (
            <div className="mt-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Uploading audio...</p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the audio file here...'
                  : `Drag & drop ${AUDIO_CATEGORIES[selectedCategory]?.label.toLowerCase()} here, or click to select`
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                MP3, WAV up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Audio Files Display by Category */}
      {Object.keys(audioByCategory).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Audio Files ({audioFiles.length})
          </h4>
          
          {Object.entries(audioByCategory).map(([categoryKey, categoryAudios]) => {
            const category = AUDIO_CATEGORIES[categoryKey] || AUDIO_CATEGORIES.general;
            
            return (
              <div key={categoryKey} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">{category.icon}</span>
                  <h5 className="font-medium text-sm">{category.label}</h5>
                  <span className={`px-2 py-1 text-xs rounded-full ${category.color}`}>
                    {categoryAudios.length} file{categoryAudios.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {categoryAudios.map((audio) => (
                    <div key={audio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handlePlayAudio(audio.id, audio.url)}
                          className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                        >
                          {playingAudio === audio.id ? (
                            <PauseIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <PlayIcon className="h-4 w-4 text-blue-600" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {audio.originalName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(audio.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <audio
                          id={`audio-${audio.id}`}
                          onEnded={() => setPlayingAudio(null)}
                          onPause={() => setPlayingAudio(null)}
                        >
                          <source src={`http://localhost:5000${audio.url}`} type={audio.mimeType} />
                        </audio>
                        
                        <button
                          onClick={() => deleteAudio.mutate(audio.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          disabled={deleteAudio.isLoading}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AudioUpload;