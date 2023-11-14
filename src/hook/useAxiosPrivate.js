import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { axiosPrivate } from '../api/axios';
import auth from '../utils/auth';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const path = useLocation();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config) => {
      if (!config.headers.authorization) {
        config.headers.authorization = `Bearer ${auth.getAccessToken()}`;
      }
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    });

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response.status === 403 || error.response.status === 401) {
          const newAccessToken = await refresh();
          if (newAccessToken === '') {
            // Refresh token expired
            auth.logout();
            navigate('/auth/login', { state: path.pathname });
            window.location.reload();
          }
          prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.response.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth.getAccessToken(), refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
