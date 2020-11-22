var video = document.getElementById('webcam');
navigator.mediaDevices.getUserMedia(
	{audio: true, video: true}
).then(audiovideo => 
	video.srcObject = audiovideo
).catch(err => console.error(err))