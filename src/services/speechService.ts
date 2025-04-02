import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

interface SpeechServiceConfig {
  speechKey: string | undefined;
  speechRegion: string | undefined;
}

class SpeechService {
  private speechConfig: sdk.SpeechConfig | null = null;

  private recognizer: sdk.SpeechRecognizer | null = null;

  constructor() {
    const config: SpeechServiceConfig = {
      speechKey: process.env.REACT_APP_AZURE_SPEECH_KEY,
      speechRegion: process.env.REACT_APP_AZURE_SPEECH_REGION,
    };

    if (config.speechKey && config.speechRegion) {
      this.speechConfig = sdk.SpeechConfig.fromSubscription(config.speechKey, config.speechRegion);
      this.speechConfig.speechRecognitionLanguage = 'en-US';
    }
  }

  public async startListening(
    onRecognized: (text: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    if (!this.speechConfig) {
      onError('Speech configuration not initialized. Please check your Azure credentials.');
      return;
    }

    try {
      this.recognizer = new sdk.SpeechRecognizer(this.speechConfig);

      this.recognizer.recognized = (_s: unknown, e: sdk.SpeechRecognitionEventArgs) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          onRecognized(e.result.text);
        }
      };

      this.recognizer.canceled = (_s: unknown, e: sdk.SpeechRecognitionCanceledEventArgs) => {
        onError(`Speech recognition canceled: ${e.errorDetails}`);
      };

      await this.recognizer.startContinuousRecognitionAsync();
    } catch (error) {
      onError(`Error starting speech recognition: ${error}`);
    }
  }

  public async stopListening(): Promise<void> {
    if (this.recognizer) {
      try {
        await this.recognizer.stopContinuousRecognitionAsync();
        this.recognizer.close();
        this.recognizer = null;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error stopping speech recognition:', error);
      }
    }
  }
}

export const speechService = new SpeechService();
