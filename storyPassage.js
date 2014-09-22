angular.module('storyPassage', ['ngSanitize'], function($compileProvider) {
    // configure new 'compile' directive by passing a directive
    // factory function. The factory function injects the '$compile'
    $compileProvider.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
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
        }
      }

      if($scope.img_psg == true) {
        $scope.linkImg = rawText.split(",");
        $scope.linkTo = $scope.linkImg[1];
        $scope.linkText = [$scope.linkImg[0] + ".png"];
      } else if($scope.list_psg == true){
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
      }
    };
  }]);
