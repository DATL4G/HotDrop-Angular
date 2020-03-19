export const environment = {
  production: true,
  protocol: 'https',
  websocketProtocol: 'wss',
  serverUri: 'hotdrop.interapps.de',
  rtcConfig: {
    iceServers: [{
      urls: [
        'stun:hotdrop.interaapps.de:3478',
      ]
    }, {
      urls: [
        'turn:hotdrop.interaapps.de',
        'turn:hotdrop.interaapps.de?transport=tcp',
        'turns:hotdrop.interaapps.de',
        'turns:hotdrop.interaapps.de?transport=tcp'
      ],
      credential: 'P1kzSUhmelAtNFs3JjtPKVJXcl1aUX58R3tUKzhUQChGXn0xQllFQjlVRTI2Tl9HTEtJMExDY3U1aw==',
      username: 'WHTh9V7B3QFCY1j5',
    }]
  }
};
