import React, { useState } from 'react';
import './UploadPage.css';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import TemplateForm from '../../components/TemplateForm/TemplateForm';
import VideoForm from '../../components/VideoForm/VideoForm';

const TEMPLATE_ID = '7wpnPQZzwrdw5dOgxo'; // Bannerbear template ID
const videoFormInputArray = ['Title', 'Description']; // fields for the Video Form

const UploadPage = () => {
  const [imageObjName, setImageObjName] = useState(null); // name of the image object in the template

  const [templatePreview, setTemplatePreview] = useState(null); // URL of the template preview image
  const [thumbnailUrl, setThumbnailUrl] = useState(null); // URL of the thumbnail generated
  const [imageUrl, setImageUrl] = useState(null); // URL of the image uploaded by user

  const [videoFormInput, setVideoFormInput] = useState({}); // an object to hold the Video Form fields
  const [modifiableFields, setModifiableFields] = useState(null); // modifiable fields in the template

  const [loading, setLoading] = useState(false);

  // Get modifiable fields from the template
  React.useEffect(() => {
    async function getTemplate() {
      const res = await fetch(`https://api.bannerbear.com/v2/templates/${TEMPLATE_ID}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_BB_API_KEY}`,
        },
      });

      const data = await res.json();
      var availableModifications = data.available_modifications
        .filter((modification) => modification.hasOwnProperty('text')) // only allow users to change texts
        .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

      setTemplatePreview(data.preview_url);
      setImageObjName(data.available_modifications.find((x) => x.hasOwnProperty('image_url')).name); // get the name of the image object (image_container)
      setModifiableFields(availableModifications); // for field mapping in Template Value Form

      setVideoFormInput(videoFormInputArray.reduce((obj, x) => ({ ...obj, [x]: '' }), {})); // insert the values in the array into an object
    }
    getTemplate();
  }, []);

  const handleFields = async (modifications) => {
    modifications = [...modifications, { name: imageObjName, image_url: imageUrl }]; // add the image object to the array of text objects
    const thumbnail = await generateThumbnail(modifications);

    setLoading(false);
    setThumbnailUrl(thumbnail);
  };

  const generateThumbnail = async (modifications) => {
    setLoading(true);
    var data = {
      template: TEMPLATE_ID,
      modifications: modifications,
    };
    const res = await fetch('https://sync.api.bannerbear.com/v2/images', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_BB_API_KEY}`,
      },
    });
    const imageData = await res.json();

    return imageData.image_url_jpg;
  };

  const handleImageUrl = (imageUrl) => {
    setImageUrl(imageUrl);
  };


  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setVideoFormInput((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className='upload-page'>
      <div className='flex-container flex-column ml mr'>
        <div>
          <h3>Selected Template</h3>
          {templatePreview && <img className='preview-image' src={templatePreview} alt='template preview' />}
          <hr />
        </div>
        <div className='flex-container'>
          <div>
            <div className='mt mb'>
              <h3>Video</h3>
              <VideoForm videoFormInputArray={videoFormInputArray} handleInputChange={handleInputChange}></VideoForm>
            </div>
            <hr />
            <div className='mt mb'>
              <h3>Upload Image</h3>
              <ImageUploader handleImageUrl={handleImageUrl}></ImageUploader>
            </div>
            <hr />
            <div className='mt mb'>
              {modifiableFields && (
                <TemplateForm videoFormInput={videoFormInput} modifiableFields={modifiableFields} handleFields={handleFields}></TemplateForm>
              )}
              {loading && <div className='mt'>Saving...</div>}
            </div>
          </div>
          <div className='ml'>
            <h3>Preview</h3>
            <video width='750' poster={thumbnailUrl} controls>
              <source src='video.mp4' type='video/mp4' />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
