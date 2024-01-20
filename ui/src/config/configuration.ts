//TODO: window type
const config = {
  apiUrl: `http://${(window as any).REACT_APP_API_HOST}`,
  socketUrl: `ws://${(window as any).REACT_APP_API_HOST}.`,
};

export default config;
