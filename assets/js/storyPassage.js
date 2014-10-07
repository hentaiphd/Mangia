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
      $scope.cur_psg = num;
      for(i = 0; i < data.data.length; i++){
        if(data.data[i].title == num){
          return data.data[i];
        }
      }
    };

    //for switching image on hover
    $scope.hoverIn = function(){
      if($scope.img_hover == true){
        this.hoverEdit = true;
        $scope.linkImg = ["assets/img/" + $scope.linkImgSet[1] + ".png"];
      }
    };

    $scope.hoverOut = function(){
      if($scope.img_hover == true){
        this.hoverEdit = false;
        $scope.linkImg = ["assets/img/" + $scope.linkImgSet[0] + ".png"];
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
      $scope.img_hover = false;
      $scope.layout_1 = false;
      $scope.two_horizontal = false;

      for(i = 0; i < rawObj.tags.length; i++){
        switch(rawObj.tags[i]) {
          case "list":
            $scope.list_psg = true;
            break;
          case "inline":
            $scope.inline_psg = true;
            break;
          case "img":
            $scope.img_psg = true;
            break;
          case "img2":
            $scope.img_two = true;
            break;
          case "plain":
            $scope.plain = true;
            break;
          case "hoverimg":
            $scope.img_hover = true;
            break;
          case "two_horizontal":
            $scope.two_horizontal = true;
        }
      }

      if($scope.img_psg == true) {
        $scope.linkImgSet = rawText.split(",");
        $scope.linkImg = ["assets/img/" + $scope.linkImgSet[0] + ".png"];
        $scope.linkTo = $scope.linkImgSet[1];
      } else if($scope.img_hover == true){
        $scope.linkImgSet = rawText.split(",");
        //non-hover img
        $scope.linkImg = ["assets/img/" + $scope.linkImgSet[0] + ".png"];
        //hover img
        $scope.linkHover = ["assets/img/" + $scope.linkImgSet[1] + ".png"];
        $scope.linkTo = $scope.linkImgSet[2];
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
      } else if($scope.plain == true) {
        $scope._text = rawText;
      } else if($scope.two_horizontal == true) {
        var linkTextRegExp = /\[\[([^)]+)\|/;
        var linkToRegExp = /\|([^)]+)\]\]/;

        $scope.linkText = linkTextRegExp.exec(rawText)[1];
        $scope.linkTo = linkToRegExp.exec(rawText)[1];

        $scope.linkImgSet = rawText.split("^");
        $scope.linkImg = "assets/img/" + $scope.linkImgSet[1] + ".png";

        rawText = rawText.replace("^" + $scope.linkImgSet[1], "");

        $scope.position = [["20%","16%"],["70%","15%"],["70%","53%"]];
        console.log($scope.position[0][1]);
        $scope.parsedText = rawText.replace("[[" + $scope.linkText + "|" + $scope.linkTo + "]]", "<a ng-click=\"fillLinkListPassage('" + $scope.linkTo + "')\" href='#'>" + $scope.linkText + "</a>").replace(/[\]}[{|]/g,'');
        $scope.parsedText = $scope.parsedText.split("*");

        $scope.partone = $sce.trustAsHtml($scope.parsedText[0]);
        $scope.parttwo = $sce.trustAsHtml($scope.parsedText[1]);
        $scope.partthree = $sce.trustAsHtml($scope.parsedText[2]);
      }
    };
  }]);
