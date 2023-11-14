import { axiosClient } from '../api/axios';
import auth from '../utils/auth';

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const response = await axiosClient.post('../token/refresh/', {
        refresh: auth.getRefreshToken(),
      });

      auth.setAccessToken(response.access);
      return response.access;
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  return refresh;
};

export default useRefreshToken;
