angular.module('storyPassage', ['ngSanitize'], function($compileProvider) {
  //comments here https://docs.angularjs.org/api/ng/service/$compile
    $compileProvider.directive('compile', function($compile) {
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
            return scope.$eval(attrs.compile);
          },
          function(value) {
            element.html(value);
            $compile(element.contents())(scope);
          }
        );
      };
    });
  })
  .controller('PassageController', ['$scope', '$sce', function($scope, $sce) {
    $scope.findPassage = function(num) {
      for(i = 0; i < data.data.length; i++){
        if(data.data[i].title == num){
          return data.data[i];
        }
      }
    };

    $scope.fillLinkListPassage = function(newnum) {
      num = typeof newnum !== 'undefined' ? newnum : 0;
      var rawObj = $scope.findPassage(num);
      var rawText = $scope.findPassage(num).text;

      //different types of passages
      $scope.img_psg = false;
      $scope.list_psg = false;
      $scope.inline_psg = false;
      $scope.img_two = false;
      $scope.plain = false;

      for(i = 0; i < rawObj.tags.length; i++){
        if(rawObj.tags[i] == "list") {
          $scope.list_psg = true;
          console.log("list");
        } else if(rawObj.tags[i] == "inline") {
          $scope.inline_psg = true;
          console.log("inline");
        } else if(rawObj.tags[i] == "img") {
          $scope.img_psg = true;
          console.log("img");
        } else if(rawObj.tags[i] == "img2") {
          $scope.img_two = true;
        } else if(rawObj.tags[i] == "plain") {
          $scope.plain = true;
        }
      }

      if($scope.img_psg == true) {
        $scope.linkImg = rawText.split(",");
        $scope.linkTo = $scope.linkImg[1];
        $scope.linkText = ["assets/img/" + $scope.linkImg[0] + ".png"];
      } else if($scope.img_two == true){
        var imgLinkObj = rawText.split("&");
        $scope.linkTo = [];
        $scope.linkText = [];

        var imgOne = imgLinkObj[0].split(",");
        $scope.linkTo.push(imgOne[1]);
        $scope.linkText.push("assets/img/" + imgOne[0] + ".png");

        var imgTwo = imgLinkObj[1].split(",");
        $scope.linkTo.push(imgTwo[1]);
        $scope.linkText.push("assets/img/" + imgTwo[0] + ".png");
      }else if($scope.list_psg == true){
        var linkTextRegExp = /\[\[([^)]+?)\]\]/g;
        var linkToRegExp = /\|([^)]+?)\]\]/g;
        $scope.linkTo = rawText.match(linkToRegExp);
        $scope.linkText = rawText.match(linkTextRegExp);

        for(i = 0; i < $scope.linkTo.length; i++){
          $scope.linkTo[i] = $scope.linkTo[i].replace("|", "").replace(/[\]}[{|]/g,'');
          $scope.linkText[i] = $scope.linkText[i].replace("|" + $scope.linkTo[i], "").replace(/[\]}[{|]/g,'');
        }
      } else if($scope.inline_psg == true) {
        var linkTextRegExp = /\[\[([^)]+)\|/;
        var linkToRegExp = /\|([^)]+)\]\]/;

        $scope.linkText = linkTextRegExp.exec(rawText)[1];
        $scope.linkTo = linkToRegExp.exec(rawText)[1];

        parsedText = rawText.replace("[[" + $scope.linkText + "|" + $scope.linkTo + "]]", "<a ng-click=\"fillLinkListPassage('" + $scope.linkTo + "')\" href='#'>" + $scope.linkText + "</a>").replace(/[\]}[{|]/g,'');

        $scope.html = $sce.trustAsHtml(parsedText);
      } else if($scope.plain == true) {
        $scope._text = rawText;
      }
    };
  }]);
