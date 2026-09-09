// Copy to config.js and fill in to enable cross-device favorite sync.
// Without config.js, optional email/password accounts still work on this device only.
window.HK_BUS_CONFIG = {
  auth: {
    // Set true after adding a Firebase web app config below.
    cloudSync: false,
    firebase: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    },
  },
};
