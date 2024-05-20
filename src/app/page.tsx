import React from 'react';
import UploadForm from './components/UploadForm';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Image Upload to Cloudinary</h1>
      <UploadForm />
    </div>
  );
};

export default Home;