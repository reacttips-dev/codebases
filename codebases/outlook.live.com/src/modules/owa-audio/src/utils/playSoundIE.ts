export default function playSoundIE(url: string) {
    const audioTag = document.createElement('audio');
    audioTag.src = url;
    audioTag.autoplay = true;
    audioTag.onended = onAudioClipEnd;

    document.body.appendChild(audioTag);
}

function onAudioClipEnd(this: HTMLElement, ev: MediaStreamErrorEvent) {
    document.body.removeChild(this);
}
