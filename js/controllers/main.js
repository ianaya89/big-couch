angular.module('big-coach', [])

.controller('MainCtrl', function($scope, $sce) {
  $scope.videoUrl = 'videos/ciudad.mp4';
  $scope.video = null;
  $scope.frameRates = FrameRates;
  $scope.frame = 0;
  $scope.fps = 25;
  $scope.smpte = '00:00:00:00';

  $scope.videoFrame = new VideoFrame({
    id: 'videoPlayer',
    frameRate: $scope.fps,
    callback: function (response, format) {
      switch (format) {
        case 'SMPTE':
          $scope.$apply(function () {
            $scope.smpte = response;
          });
        break;

        case 'frame':
          $scope.$apply(function () {
            $scope.frame = response;
          });
        break;
      }
    }
  });

  $scope.videoFrame.listen('SMPTE');
  $scope.videoFrame.listen('frame');

  $scope.loadVideo = function() {
    $scope.videoUrl = $sce.trustAsResourceUrl($scope.video.path);
  };

  initControls($scope.videoFrame);

})

.directive('fileInput', function ($parse) {
    return {
        restrict: "EA",
        template: "<input type='file' />",
        replace: true,          
        link: function (scope, element, attrs) {
           
            var modelGet = $parse(attrs.fileInput);
            var modelSet = modelGet.assign;
            var onChange = $parse(attrs.onChange);
            
            var updateModel = function () {
                scope.$apply(function () {
                    modelSet(scope, element[0].files[0]);
                    onChange(scope);
                });                    
            };
            
            element.bind('change', updateModel);
        }
    };
});