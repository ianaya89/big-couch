angular.module('big-coach', [])

.controller('MainCtrl', function($scope, $sce) {
  $scope.videoUrl = 'videos/ciudad.mp4';
  $scope.video = null;

  $scope.frame = function() {
    return videoFrame.get();
  };

  $scope.smpte = function() {
    return videoFrame.toSMPTE();
  };

  $scope.loadVideo = function() {
    $scope.videoUrl = $sce.trustAsResourceUrl($scope.video.path);
  };

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