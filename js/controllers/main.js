angular.module('big-coach', [])

.controller('MainCtrl', function() {
  this.frame = function() {
    return videoFrame.get();
  };

  this.smpte = function() {
    return videoFrame.toSMPTE();
  };
});