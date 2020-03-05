export const environment = {
  production: false,
  protocol: 'http',
  serverUri: 'localhost:8080',
  rtcConfig: {
    'iceServers': [{
      urls: 'stun:stun.l.google.com:19302'
    }, {
      urls: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }]
  }
};
