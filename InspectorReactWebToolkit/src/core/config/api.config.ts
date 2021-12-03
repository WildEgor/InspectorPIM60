

const serverURI = process.env.NODE_ENV === 'production' ? '192.168.99.10' : '192.168.99.10';

const inspectorDevices = [
  {
    ip: '192.168.99.10',
  },
  {
    ip: '192.168.99.9',
  }
]

export { 
  serverURI,
  inspectorDevices
};
