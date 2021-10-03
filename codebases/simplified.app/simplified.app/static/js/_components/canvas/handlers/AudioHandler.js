/**
 * AudioHandler
 *
 * consists utilities to handle audio
 */

class AudioHandler {
  constructor(handler) {
    this.handler = handler;
    this.audioObjects = {}; // Map of `audio` tag refs
  }

  // Initialize audio sources
  initialize = (audioSources = []) => {
    this.clearAllMusic();
    for (const audioSource of audioSources) {
      const audio = new Audio();
      audio.id = audioSource?.id;
      audio.src = audioSource?.src;
      audio.currentTime = audioSource?.offset ?? 0;
      audio.volume = audioSource.volume ?? 0.5;
      this.audioObjects[audioSource?.id] = audio;
    }
  };

  // Set volume
  setVolume = (id, volume = 0.5) => {
    const audioObj = this.getAudioById(id);
    if (audioObj) {
      audioObj.volume = volume;
    }
  };

  // Clear the music data
  clearAllMusic = () => {
    for (const obj in this.audioObjects) {
      const element = this.audioObjects[obj];
      if (element) {
        element.pause();
      }
      delete this.audioObjects[obj];
    }
  };

  // Get created audio element by id
  getAudioById = (id) => {
    if (!this.audioObjects) {
      return;
    }
    return this.audioObjects[id];
  };

  // Start playing audio
  play = (id) => {
    const audioObj = this.getAudioById(id);
    if (audioObj) {
      audioObj.play();
    }
  };

  // Start playing audio from 0
  pause = (id) => {
    const audioObj = this.getAudioById(id);
    if (audioObj) {
      audioObj.pause();
    }
  };

  // Seek to specific duration
  seek = (id, duration = 0) => {
    const audioObj = this.getAudioById(id);
    if (audioObj) {
      audioObj.currentTime = duration;
    }
  };

  stop = (id) => {
    const audioObj = this.getAudioById(id);
    if (audioObj) {
      audioObj.pause();
      audioObj.currentTime = 0;
    }
  };

  // Stop all music instances
  stopAll = () => {
    for (const obj in this.audioObjects) {
      const element = this.audioObjects[obj];
      if (element) {
        element.pause();
        element.currentTime = 0;
      }
    }
  };
}

export default AudioHandler;
