

const serverURI = process.env.NODE_ENV === 'production' ? '192.168.99.9' : '192.168.99.9';

const inspectorDevices = [
  {
    ip: '192.168.99.9',
  },
  {
    ip: '192.168.99.30',
  }
]

export { 
  serverURI,
  inspectorDevices
};
