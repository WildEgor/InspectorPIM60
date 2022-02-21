
const inspectorDevices = [
  {
    ip: process.env.NODE_ENV === 'production' ? window.location.hostname : '192.168.99.9',
  },
]

export { 
  inspectorDevices
};
