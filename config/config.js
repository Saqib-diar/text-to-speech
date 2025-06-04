const convict = require('convict');

const config = convict({
  elevenlabs: {
    apiKey: {
      doc: 'ElevenLabs API key',
      format: String,
      default: '',
      env: 'ELEVENLABS_API_KEY'
    },
    voiceId: {
      doc: 'Voice ID to use',
      format: String,
      default: '',
      env: 'ELEVENLABS_VOICE_ID'
    }
  },
  port: {
    doc: 'Port to run the server on',
    format: 'port',
    default: 3000,
    env: 'PORT'
  }
});

config.validate(); // Ensure everything required is present
module.exports = config;
