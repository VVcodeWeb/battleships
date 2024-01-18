const config = () => ({
  api: `localhost:${process.env.REACT_APP_IO_PORT}` as const,
});

export default config;
