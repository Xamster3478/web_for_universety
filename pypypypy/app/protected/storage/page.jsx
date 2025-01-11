'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { File, Image, FileText, FileAudio, FileVideo, Upload, Search, Trash2, Download } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';

const getFileIcon = (type) => {
  switch (type) {
    case 'application/pdf':
      return <FileText className="text-red-500" />;
    case 'image/jpeg':
    case 'image/png':
      return <Image className="text-green-500" />;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return <FileText className="text-green-700" />;
    case 'audio/mpeg':
      return <FileAudio className="text-blue-500" />;
    case 'video/mp4':
      return <FileVideo className="text-purple-500" />;
    default:
      return <File className="text-gray-500" />;
  }
};

export default function StoragePage() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    console.log('Initializing user...');
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      console.log('Sending request to create bucket...');
      const response = await fetch('https://backend-for-uni.onrender.com/api/supabase/get-bucket/0', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      console.log('Bucket response:', result);
      setUserId(result.bucket_id || 0);
      fetchFiles(result.bucket_id || 0);
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  };

  const fetchFiles = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://backend-for-uni.onrender.com/api/supabase/get-files/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      setFiles(result.file.map(file => {
        const [name, type] = file.split('|');
        console.log(name, type);
        return { name, type };
      }));
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    console.log('File selected:', file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`https://backend-for-uni.onrender.com/api/supabase/upload-file/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
      });
      if (response.ok) {
        console.log('File uploaded successfully');
        await fetchFiles(userId);
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (!userId) {
      console.log('userId is null');
      return;
    }

    console.log('Deleting file:', fileName);

    try {
      const response = await fetch(`https://backend-for-uni.onrender.com/api/supabase/delete-file/${userId}?file_name=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('File deleted successfully');
        await fetchFiles(userId);
      } else {
        console.error('Error deleting file:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownloadFile = async (fileName) => {
    if (!userId) return;

    try {
      const response = await fetch(`https://backend-for-uni.onrender.com/api/supabase/download-file/${userId}?file_name=${encodeURIComponent(fileName)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      if (result.file_url) {
        window.open(result.file_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Хранилище файлов</CardTitle>
          <div>
            <Input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button as="span" className="cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <Upload className="mr-2 h-4 w-4" /> Загрузить
              </Button>
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск файлов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file, index) => (
              <div key={index} className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-100 relative group">
                {getFileIcon(file.type)}
                <span className="mt-2 text-sm text-center truncate w-full">{file.name}</span>
                <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDownloadFile(file.name)}
                    className="p-1 bg-blue-500 text-white rounded-full"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    className="p-1 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

