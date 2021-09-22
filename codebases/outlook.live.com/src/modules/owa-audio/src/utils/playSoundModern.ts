let context: AudioContext;

export default async function playSoundModern(url: string) {
    // We may later to decide to cache the sound data ourselves.
    // For now, we depend on the browser cache to do so for us.
    let audioData = await fetchAudioData(url);

    playAudioData(audioData);
}

// Need to lazily construct the context for jest not to barf on any file
// that imports this one
function getContext() {
    return context || (context = new AudioContext());
}

async function fetchAudioData(url: string) {
    let audioRequest = await fetch(url);
    let audioFile = await audioRequest.arrayBuffer();
    let audioData = await getContext().decodeAudioData(audioFile);
    return audioData;
}

function playAudioData(audioData: AudioBuffer) {
    let source = getContext().createBufferSource();
    source.buffer = audioData;
    source.connect(getContext().destination);
    source.start(0);
}
