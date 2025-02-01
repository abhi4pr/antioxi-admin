import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route, useLocation } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { BASE_URL } from './config/constant';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token && location.pathname !== '/auth/login') {
    return <Navigate to="/auth/login" />;
  }
  return children;
};

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <ToastContainer />
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/login',
    element: lazy(() => import('./views/auth/signup/Login'))
  },

  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard, // Apply AuthGuard to protect routes
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/motivationals',
        element: lazy(() => import('./views/extra/Motivationals'))
      },
      {
        exact: 'true',
        path: '/motivational',
        element: lazy(() => import('./views/extra/Motivational'))
      },
      {
        exact: 'true',
        path: '/questions',
        element: lazy(() => import('./views/extra/Questions'))
      },
      {
        exact: 'true',
        path: '/question',
        element: lazy(() => import('./views/extra/Question'))
      },
      {
        exact: 'true',
        path: '/tasks',
        element: lazy(() => import('./views/extra/Tasks'))
      },
      {
        exact: 'true',
        path: '/task',
        element: lazy(() => import('./views/extra/Task'))
      },
      // {
      //   exact: 'true',
      //   path: '/task/:id',  
      //   element: lazy(() => import('./views/extra/Task')) 
      // },
      {
        exact: 'true',
        path: '/videos',
        element: lazy(() => import('./views/extra/Videos'))
      },
      {
        exact: 'true',
        path: '/video',
        element: lazy(() => import('./views/extra/Video'))
      },
      {
        exact: 'true',
        path: '/users',
        element: lazy(() => import('./views/extra/Users'))
      },
      {
        exact: 'true',
        path: '/posts',
        element: lazy(() => import('./views/extra/Posts'))
      },
      {
        exact: 'true',
        path: '/post',
        element: lazy(() => import('./views/extra/Post'))
      },
      {
        exact: 'true',
        path: '/feedbacks',
        element: lazy(() => import('./views/extra/Feedbacks'))
      },
      {
        exact: 'true',
        path: '/rewards',
        element: lazy(() => import('./views/extra/Rewards'))
      },
      {
        exact: 'true',
        path: '/reward',
        element: lazy(() => import('./views/extra/Reward'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;
