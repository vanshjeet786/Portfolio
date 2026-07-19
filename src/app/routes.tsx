import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/app/App';

// Layout placeholders that contain clean semantic containers
export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'project/:id',
        element: <div id="project-layout-container" className="hidden" />,
      },
      {
        path: 'resume',
        element: <div id="resume-layout-container" className="hidden" />,
      },
      {
        path: 'about',
        element: <div id="about-layout-container" className="hidden" />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);
