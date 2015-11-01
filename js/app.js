function initControls(videoFrame) {
  var isPlaying = false;

  document.getElementById('play').addEventListener('click', function(){
    if (isPlaying) {
      videoFrame.video.pause();
    } 
    else {
      videoFrame.video.play();
    }

    isPlaying = !isPlaying;
  });

  document.getElementById('shoot').addEventListener('click', function(b){
    var c = videoFrame.toSMPTE();
    var a = document.createElement('canvas');

    a.width = videoFrame.video.videoWidth;
    a.height = videoFrame.video.videoHeight;
    a.getContext('2d').drawImage(videoFrame.video, 0, 0);
    a = a.toDataURL('image/jpeg');

    if ('dataURI' === b) {
      return a;
    }

    document.getElementById('videoFrameScreenshots').innerHTML += '<li><a class="thumbnail"><img src="' + a + '" alt="' + c + '" /><p>' + c + "</p></a></li>";
  });

  document.getElementById('bw').addEventListener('click', function(){
    videoFrame.seekBackward(1, function(a, b){
      console.log(a, b);
    });
  });

  document.getElementById('fw').addEventListener('click', function(){
    videoFrame.seekForward(1, function(a, b){
      console.log(a, b);
    });
  });
}