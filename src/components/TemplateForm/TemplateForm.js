import React, { useState } from 'react';
import './TemplateForm.css';

const TemplateForm = (props) => {
  const [inputs, setInputs] = useState({});

  const handleSelectChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const modifications = [];

    if (Object.keys(inputs).length === 0) {
      
      props.modifiableFields.forEach((field) => { // use default values from video input
        inputs[field.name] = Object.values(props.videoFormInput)[0];
      });
    }

    Object.keys(inputs).forEach((field) => {
      modifications.push({
        name: field,
        text: inputs[field],
      });
    });
    props.handleFields(modifications);
  };

  return (
    <div className='template-form'>
      <form onSubmit={handleSubmit}>
        <h3>Template Values</h3>
        {props.modifiableFields.map((field) => {
          return (
            <div key={field.name}>
              <label>
                {field.name}:{' '}
                <select name={field.name} onChange={handleSelectChange}>
                  {Object.keys(props.videoFormInput).map((input) => (
                    <option value={props.videoFormInput[input]} key={input}>
                      {input}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
        <input className='save-btn' type='submit' value='Save' />
      </form>
    </div>
  );
};

export default TemplateForm;
