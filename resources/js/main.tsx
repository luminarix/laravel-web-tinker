import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '../css/index.css';

const root = document.getElementById('root');
const path = root?.dataset.path || '';
const environment = root?.dataset.environment || 'unknown';

ReactDOM.createRoot(root!).render(
    <React.StrictMode>
        <App path={path} environment={environment}/>
    </React.StrictMode>,
);