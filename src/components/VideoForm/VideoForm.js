import React from 'react';
import './VideoForm.css';

const VideoForm = (props) => (
  <div className='video-form'>
    <form>
      {props.videoFormInputArray.map((input, i) => (
        <div key={input}>
          <label>
            {input}: <input type='text' name={input} onChange={props.handleInputChange} />
          </label>
        </div>
      ))}
    </form>
  </div>
);

export default VideoForm;
