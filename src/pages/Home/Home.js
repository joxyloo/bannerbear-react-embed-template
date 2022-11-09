import React from 'react';
import './Home.css';
import TemplateEditor from '../../components/TemplateEditor/TemplateEditor';
import TemplateSelector from '../../components/TemplateSelector/TemplateSelector';

const Home = () => {
  const [mode, setMode] = React.useState(null); // mode: new/select/starter
  const [sampleTemplateId, setStarterTemplateId] = React.useState(null);
  const [templateEditorUrl, setTemplateEditorUrl] = React.useState(null);

  const updateMode = (mode) => {
    setMode(mode);
  };

  const selectTemplate = (selectedId) => {
    setStarterTemplateId(selectedId);
    setMode('starter');
  };

  React.useEffect(() => {
    async function getTemplateEditorUrl() {
      let templateId, res;

      if (mode === 'new') {
        res = await createEmptyTemplate();
      } else if (mode === 'starter') {
        res = await duplicateTemplate(sampleTemplateId);
      }

      if (res.uid) {
        setStarterTemplateId(res.uid);
        templateId = res.uid;
        console.log('New template created successfully! Template ID: ' + templateId);
      }

      if (templateId) {
        const sessionRes = await createSession(templateId);

        if (sessionRes.session_editor_url) {
          setTemplateEditorUrl(sessionRes.session_editor_url);
          console.log('New session created successfully! Session URL: ' + sessionRes.session_editor_url);
          setStarterTemplateId(null);
        }
      }
    }
    getTemplateEditorUrl();
  }, [mode]);

  return (
    <div className='Home'>
      <div className='buttonOptions'>
        <button onClick={() => updateMode('new')}>New Template</button>
        <button onClick={() => updateMode('select')}>Create from Existing Templates</button>
      </div>

      {mode !== 'select' && <TemplateEditor mode={mode} templateEditorUrl={templateEditorUrl}></TemplateEditor>}
      {mode === 'select' && <TemplateSelector selectTemplate={selectTemplate}></TemplateSelector>}
    </div>
  );
};

async function createEmptyTemplate() {
  var data = {
    name: 'New Template',
    width: 1280,
    height: 720,
  };
  const res = await fetch('https://api.bannerbear.com/v2/templates', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  });

  return res.json();
}

async function createSession(templateId) {
  var data = {
    template: templateId,
  };
  const res = await fetch('https://api.bannerbear.com/v2/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  });

  return res.json();
}

async function duplicateTemplate(templateId) {
  const res = await fetch(`https://api.bannerbear.com/v2/templates?source=${templateId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  });

  return res.json();
}

export default Home;
