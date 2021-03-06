angular.module('big-coach', [])

.controller('MainCtrl', function($scope, $sce) {
  $scope.videoUrl = 'videos/ciudad.mp4';
  $scope.video = null;
  $scope.frameRates = FrameRates;
  $scope.frame = 0;
  $scope.fps = 25;
  $scope.newLabel = '';
  $scope.smpte = '00:00:00:00';

  $scope.labels = [{
    color: '#fc605b',
    name: 'Salidas'
  },
  {
    color: '#fdbc40',
    name: 'Corners Ofensivos'
  },
  {
    color: '#34c84a',
    name: 'Corners Defensivos'
  },
  {
    color: '#57acf5',
    name: 'Goles'
  }
  ];

  $scope.addLabel = function() {
    if ($scope.newLabel) {
      $scope.labels.push({
        name: $scope.newLabel,
        color: getRandomColor()
      });

      $scope.newLabel = '';
    }
  };

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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