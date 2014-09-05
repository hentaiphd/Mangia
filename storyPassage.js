angular.module('storyPassage', [])
  .controller('PassageController', ['$scope', function($scope) {
    var rawText = data.data[1].text;
    var linkTextRegExp = /\[\[([^)]+?)\]\]/g;
    var linkToRegExp = /\|([^)]+?)\]\]/g;

    $scope.trueRaw = data.data[0].text;

    $scope.linkText = rawText.match(linkTextRegExp);
    $scope.linkTo = rawText.match(linkToRegExp);

    var parsedText = rawText.replace("|" + $scope.linkTo, "").replace(/[\]}[{|]/g,'');
    $scope.raw = parsedText;
    //$scope.raw = rawText;

    $scope.fillInlinePassage = function(num) {
      //this works don't change it damn it
      num = typeof num !== 'undefined' ? num : 0;

      var linkTextRegExp = /\[\[([^)]+)\|/;
      var linkToRegExp = /\|([^)]+)\]\]/;
      rawText = data.data[num].text;

      /*inline = true;
      if(inline){
        linkTextRegExp = /\[\[([^)]+)\|/;
        linkToRegExp = /\|([^)]+)\]\]/;
      } else {

      }*/

      $scope.linkText = linkTextRegExp.exec(rawText)[1];
      $scope.linkTo = linkToRegExp.exec(rawText)[1];

      parsedText = rawText.replace("|" + $scope.linkTo, "").replace(/[\]}[{|]/g,'');
      $scope.raw = parsedText;

      //$scope.linky = $sce.trustAsHtml('<a ng-click="/$scope.linkTo" href="#"">hi</a>');
    };
  }]);