export const environment = {
  production: false,
  protocol: 'http',
  websocketProtocol: 'ws',
  serverUri: 'linux-datlag:8080',
  rtcConfig: {
    iceServers: [{
      urls: [
        'stun:localhost:3478'
      ]
    }, {
      urls: [
        'turn:localhost:3478',
        'turn:localhost:3478?transport=tcp',
        'turns:localhost:3478',
        'turns:localhost:3478?transport=tcp'
      ],
      credential: 'P1kzSUhmelAtNFs3JjtPKVJXcl1aUX58R3tUKzhUQChGXn0xQllFQjlVRTI2Tl9HTEtJMExDY3U1aw==',
      username: 'WHTh9V7B3QFCY1j5',
    }]
  }
};
