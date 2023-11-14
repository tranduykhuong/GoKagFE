const { localStorage } = global.window;

const auth = {
  login(data) {
    localStorage.user = JSON.stringify(data.user);
    localStorage.accessToken = data.access_token;
    localStorage.refreshToken = data.refresh_token;
  },

  updateUser(data) {
    localStorage.user = JSON.stringify(data);
  },

  setAccessToken(token) {
    localStorage.accessToken = token;
  },

  getAccessToken() {
    return localStorage.accessToken;
  },

  setRefreshToken(token) {
    localStorage.refreshToken = token;
  },

  getRefreshToken() {
    return localStorage.refreshToken;
  },

  getUser() {
    return (localStorage.user && JSON.parse(localStorage.user)) || {};
  },

  updateAvatar(avt) {
    const user = this.getUser();
    user.avatar = avt;
    localStorage.user = JSON.stringify(user);
  },

  logout() {
    localStorage.clear();
  },
};

export default auth;
