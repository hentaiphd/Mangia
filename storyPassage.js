angular.module('storyPassage', [])
  .controller('PassageController', ['$scope', function($scope) {
    console.log(data.data);
    $scope.findPassage = function(num) {
      for(i = 0; i < data.data.length; i++){
        if(data.data[i].title == num){
          return data.data[i].text;
        }
      }
    };

    $scope.fillLinkListPassage = function(num) {
      var rawText = $scope.findPassage(num);

      //var rawText = data.data[num].text;
      var linkTextRegExp = /\[\[([^)]+?)\]\]/g;
      var linkToRegExp = /\|([^)]+?)\]\]/g;

      $scope.trueRaw = $scope.findPassage(num);

      $scope.linkTo = rawText.match(linkToRegExp);
      $scope.linkText = rawText.match(linkTextRegExp);

      for(i = 0; i < $scope.linkTo.length; i++){
        $scope.linkTo[i] = $scope.linkTo[i].replace("|", "").replace(/[\]}[{|]/g,'');
        $scope.linkText[i] = $scope.linkText[i].replace("|" + $scope.linkTo[i], "").replace(/[\]}[{|]/g,'');
      }

      var parsedText = rawText.replace(/\[\[([^)]+?)\]\]/g,'');
      $scope.raw = parsedText;
    };

    $scope.fillInlineLinkPassage = function(num) {
      //this works don't change it damn it
      num = typeof num !== 'undefined' ? num : 0;

      var linkTextRegExp = /\[\[([^)]+)\|/;
      var linkToRegExp = /\|([^)]+)\]\]/;
      rawText = data.data[num].text;

      $scope.linkText = linkTextRegExp.exec(rawText)[1];
      $scope.linkTo = linkToRegExp.exec(rawText)[1];

      parsedText = rawText.replace("|" + $scope.linkTo, "").replace(/[\]}[{|]/g,'');
      $scope.raw = parsedText;

      //$scope.linky = $sce.trustAsHtml('<a ng-click="/$scope.linkTo" href="#"">hi</a>');
    };
  }]);