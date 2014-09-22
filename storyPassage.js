angular.module('storyPassage', [])
  .controller('PassageController', ['$scope', function($scope) {
    $scope.findPassage = function(num) {
      for(i = 0; i < data.data.length; i++){
        console.log(num);
        if(data.data[i].title == num){
          return data.data[i].text;
        }
      }
    };

    $scope.fillLinkListPassage = function(newnum) {
      num = typeof newnum !== 'undefined' ? newnum : 0;
      var rawText = $scope.findPassage(num);
      $scope.img_psg = false;
      $scope.text_psg = false;
      if(rawText.indexOf("img") > -1) {
        $scope.img_psg = true;
        $scope.linkImg = rawText.split(",");
        $scope.linkTo = $scope.linkImg[2];
        $scope.linkText = [$scope.linkImg[1] + ".png"];
      } else {
        $scope.text_psg = true;
        var linkTextRegExp = /\[\[([^)]+?)\]\]/g;
        var linkToRegExp = /\|([^)]+?)\]\]/g;
        $scope.linkTo = rawText.match(linkToRegExp);
        $scope.linkText = rawText.match(linkTextRegExp);

        for(i = 0; i < $scope.linkTo.length; i++){
          $scope.linkTo[i] = $scope.linkTo[i].replace("|", "").replace(/[\]}[{|]/g,'');
          $scope.linkText[i] = $scope.linkText[i].replace("|" + $scope.linkTo[i], "").replace(/[\]}[{|]/g,'');
        }
      }

      $scope.trueRaw = $scope.findPassage(num);

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
