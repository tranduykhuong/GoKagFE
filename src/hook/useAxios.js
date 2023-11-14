import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { axiosClient } from '../api/axios';
import { addToCache } from '../store/reducers/cacheSlice';

const useAxios = (method, api, body, options, deps) => {
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const cache = useSelector((state) => state.cache);
  const dispatch = useDispatch();

  const axiosController = new AbortController();

  useEffect(() => {
    if (isLoading === false) {
      setLoading(true);

      const cacheKey = `${method}_${api}_${JSON.stringify(body)}`;

      // axiosClient[method](api, body, {
      //   ...options,
      //   signal: axiosController.signal,
      // })
      //   .then((response) => {
      //     setResponse(response);
      //   })
      //   .catch((error) => {
      //     setError(error);
      //     setLoading(false);
      //   })
      //   .then(() => {
      //     setLoading(false);
      //   });

      if (cache[cacheKey] && cache[cacheKey].expiration > Date.now()) {
        setResponse(cache[cacheKey].data);
        setLoading(false);
      } else {
        axiosClient[method](api, body, {
          ...options,
          signal: axiosController.signal,
        })
          .then((response) => {
            setResponse(response);
            const expiration = Date.now() + 300000;
            dispatch(addToCache({ cacheKey, data: response, expiration }));
          })
          .catch((error) => {
            setError(error);
            setLoading(false);
          })
          .then(() => {
            setLoading(false);
          });
      }
    }

    return () => {
      if (isLoading === true) {
        axiosController.abort();
        setLoading(false);
      }
    };
  }, [...deps]);

  return [response, error, isLoading];
};

useAxios.propTypes = {
  method: PropTypes.string.isRequired,
  api: PropTypes.string.isRequired,
  body: PropTypes.object,
  options: PropTypes.object,
  deps: PropTypes.array.isRequired,
};

useAxios.defaultProps = {
  body: {},
  options: {},
};

export default useAxios;
