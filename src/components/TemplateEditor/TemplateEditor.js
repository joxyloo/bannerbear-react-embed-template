import React from 'react';
import './TemplateEditor.css';

const TemplateEditor = (props) => {

  return (
    <div className='template-editor'>   
      <embed src={props.templateEditorUrl} width='100%' height='100%' />
    </div>
  );
};

export default TemplateEditor;
