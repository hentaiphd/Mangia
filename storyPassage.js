angular.module('storyPassage', [])
  .controller('PassageController', ['$scope', function($scope) {
    var rawText = data.data[0].text;
    //var linkTextRegExp = /\[\[([^)]+)\]\]/g;
    //var linkToRegExp = /\|([^)]+)\]\]/;
    var linkTextRegExp = /\[\[([^)]+)\|/;
    var linkToRegExp = /\|([^)]+)\]\]/;

    $scope.linkText = linkTextRegExp.exec(rawText)[1];
    $scope.linkTo = linkToRegExp.exec(rawText)[1];
    //$scope.linkText = rawText.match(linkTextRegExp)[0];

    var parsedText = rawText.replace("|" + $scope.linkTo, "").replace(/[\]}[{|]/g,'');
    $scope.raw = parsedText;
    //$scope.raw = rawText;

    $scope.fillPassage = function(num) {
      num = typeof num !== 'undefined' ? num : 0;

      rawText = data.data[num].text;

      inline = true;
      if(inline){
        linkTextRegExp = /\[\[([^)]+)\|/;
        linkToRegExp = /\|([^)]+)\]\]/;
      } else {

      }

      $scope.linkText = linkTextRegExp.exec(rawText)[1];
      $scope.linkTo = linkToRegExp.exec(rawText)[1];

      parsedText = rawText.replace("|" + $scope.linkTo, "").replace(/[\]}[{|]/g,'');
      $scope.raw = parsedText;

      //$scope.linky = $sce.trustAsHtml('<a ng-click="/$scope.linkTo" href="#"">hi</a>');
    };
  }]);