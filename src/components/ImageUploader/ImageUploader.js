import React, { useState } from 'react';
import './ImageUploader.css';
import AWS from 'aws-sdk';

const BUCKET_NAME = 'your_bucket_name';
const s3 = new AWS.S3({
  accessKeyId: 'your_access_key_id',
  secretAccessKey: 'your_secret_access_key',
});

const ImageUploader = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    setIsUploading(true);

    const res = await saveImageToBucket('image', file);
    props.handleImageUrl(res.Location);

    setImageUrl(res.Location);
    setIsUploading(false);
  };

  const saveImageToBucket = async (fileName, screenshot) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${fileName}`,
      Body: screenshot,
    };

    return await s3.upload(params).promise();
  };

  return (
    <div className='image-uploader'>
      <input type='file' onChange={handleFileInput} />
      <button onClick={() => handleUpload(selectedFile)}>Upload</button>
      {isUploading && <div>Uploading...</div>}
      {imageUrl && (
        <div>
          <img src={imageUrl} alt='' />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
