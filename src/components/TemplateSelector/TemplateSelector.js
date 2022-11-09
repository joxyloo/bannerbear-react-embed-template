import React from 'react';
import './TemplateSelector.css';

const TemplateSelector = ({ selectTemplate }) => {
  const [templateArr, setTemplateArr] = React.useState([]);

  React.useEffect(() => {
    async function getTemplates() {
      const res = await fetch('https://api.bannerbear.com/v2/templates', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
      });

      const data = await res.json();

      setTemplateArr(data);
    }
    getTemplates();
  }, []);

  return (
    <div className='TemplateSelector'>
      {templateArr.map((template) => {
        if (template.preview_url) {
          return <img key={template.uid} src={template.preview_url} alt='' onClick={() => selectTemplate(template.uid)} />;
        }
      })}
    </div>
  );
};

export default TemplateSelector;
