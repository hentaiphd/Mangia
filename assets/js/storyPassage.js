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
    $scope.hoverIn = function(row){
      if($scope.img_hover == true){
        this.hoverEdit = true;
        $scope.linkImg = ["assets/img/" + $scope.linkImgSet[1] + ".gif"];
      } else if($scope.two_float_right == true){
        if(row == 1){
          $scope.linkImg[1] = "assets/img/" + linkImgSet[1].split(",")[1] + ".png";
          $scope.textTop = "Answer.";
        } else if(row == 2){
          $scope.linkImg[2] = "assets/img/" + linkImgSet[2].split(",")[1] + ".png";
          $scope.textBottom = "Ignore.";
        }
      } else if($scope.two_link_img == true) {
        if(row == 3 /*left*/){
          $scope.linkImg[0] = "assets/img/" + linkImgSet[0].split(",")[1] + ".png";
          $scope.textTop = $scope.leftText;
        } else if(row == 4 /*right*/){
          $scope.linkImg[1] = "assets/img/" + linkImgSet[1].split(",")[1] + ".png";
          $scope.textBottom = $scope.rightText;
        }
      } else if($scope.food_img == true) {
        if ($scope.double_img) {
          if(row == 0) {
            $scope.linkImg[0] = "assets/img/" + $scope.linkImgSet[0].split(",")[0] + ".gif";
          } else {
            $scope.linkImg[1] = "assets/img/" + $scope.linkImgSet[1].split(",")[0] + ".gif";
          }
        } else {
          $scope.linkImg[0] = "assets/img/" + $scope.linkImgSet[0] + ".gif";
        }
      }
    };

    $scope.hoverOut = function(row){
      if($scope.img_hover == true){
        this.hoverEdit = false;
        $scope.linkImg = ["assets/img/" + $scope.linkImgSet[0] + ".png"];
      } else if($scope.two_float_right == true){
        if(row == 1){
          $scope.linkImg[1] = "assets/img/" + linkImgSet[1].split(",")[0] + ".png";
          $scope.textTop = "";
        } else if(row == 2){
          $scope.linkImg[2] = "assets/img/" + linkImgSet[2].split(",")[0] + ".png";
          $scope.textBottom = "";
        }
      } else if($scope.two_link_img == true) {
        if(row == 3 /*left*/){
          $scope.linkImg[0] = "assets/img/" + linkImgSet[0].split(",")[0] + ".png";
          $scope.textTop = "";
        } else if(row == 4 /*right*/){
          $scope.linkImg[1] = "assets/img/" + linkImgSet[1].split(",")[0] + ".png";
          $scope.textBottom = "";
        }
      } else if($scope.food_img == true) {
        if ($scope.double_img) {
          $scope.linkImg[0] = "assets/img/" + $scope.linkImgSet[0].split(",")[0] + "_off.png";
          $scope.linkImg[1] = "assets/img/" + $scope.linkImgSet[1].split(",")[0] + "_off.png";
        } else {
          $scope.linkImg[0] = "assets/img/" + $scope.linkImgSet[0] + "_off.png";
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
      $scope.img_hover = false;
      $scope.layout_1 = false;
      $scope.two_horizontal = false;
      $scope.two_float_right = false;
      $scope.two_link_img = false;
      $scope.food_img = false;
      $scope.startscreen = false;

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
            break;
          case "two_float_right":
            $scope.two_float_right = true;
            break;
          case "two_link_img":
            $scope.two_link_img = true;
            break;
          case "food":
            $scope.food_img = true;
            break;
        }
      }

      $scope.linkImgSet = null;
      $scope.linkImg = null;
      $scope.linkHover = null;
      $scope.linkText = null;
      $scope.linkTo = null;

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
        $scope.linkImg = [];

        var imgOne = imgLinkObj[0].split(",");
        $scope.linkTo[0] = imgOne[1];
        $scope.linkImg[0] = "assets/img/" + imgOne[0] + ".png";

        var imgTwo = imgLinkObj[1].split(",");
        $scope.linkTo[1] = imgTwo[1];
        $scope.linkImg[1] = "assets/img/" + imgTwo[0] + ".png";
      } else if($scope.list_psg == true){
        var linkTextRegExp = /\[\[([^)]+?)\]\]/g;
        var linkToRegExp = /\|([^)]+?)\]\]/g;
        $scope.linkTo = rawText.match(linkToRegExp);
        $scope.linkText = rawText.match(linkTextRegExp);
        $scope.raw = rawText;

        for(i = 0; i < $scope.linkTo.length; i++){
          $scope.raw = $scope.raw.replace($scope.linkText[i], "");
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

        $scope.parsedText = rawText.replace("[[" + $scope.linkText + "|" + $scope.linkTo + "]]", "<a ng-click=\"fillLinkListPassage('" + $scope.linkTo + "')\" href='#'>" + $scope.linkText + "</a>").replace(/[\]}[{|]/g,'');
        $scope.parsedText = $scope.parsedText.split("*");

        $scope.partone = $sce.trustAsHtml($scope.parsedText[0]);
        $scope.parttwo = $sce.trustAsHtml($scope.parsedText[1]);
        $scope.partthree = $sce.trustAsHtml($scope.parsedText[2]);
      } else if($scope.two_float_right == true) {
        linkImgSet = rawText.split("&");
        $scope.linkTo = rawText.split("|")[1].split(",");

        $scope.linkImg = [];
        //left
        $scope.linkImg[0] = "assets/img/" + linkImgSet[0] + ".png";
        //top right
        $scope.linkImg[1] = "assets/img/" + linkImgSet[1].split(",")[0] + ".png";
        $scope.textTop = "";
        //bottom right
        $scope.linkImg[2] = "assets/img/" + linkImgSet[2].split(",")[0] + ".png";
        $scope.textBottom = "";
      } else if($scope.two_link_img == true) {
        linkImgSet = rawText.split("&");
        $scope.linkTo = rawText.split("|")[1].split(",");
        $scope.leftText = rawText.split("|")[2].split("^")[0];
        $scope.rightText = rawText.split("|")[2].split("^")[1];

        $scope.linkImg = [];
        //left
        $scope.linkImg[0] = "assets/img/" + linkImgSet[0].split(",")[0] + ".png";
        $scope.textTop = "";
        //right
        $scope.linkImg[1] = "assets/img/" + linkImgSet[1].split(",")[0] + ".png";
        $scope.textBottom = "";
      } else if($scope.food_img == true) {
        $scope.linkImg = [];
        $scope.linkTo = [];

        if (rawText.indexOf("&") >= 0) {
          $scope.double_img = true;
          $scope.single_img = false;
          $scope.linkImgSet = rawText.split("&");
          $scope.linkImg[0] = "assets/img/" + $scope.linkImgSet[0].split(",")[0] + "_off.png";
          $scope.linkTo[0] = $scope.linkImgSet[0].split(",")[1];
          $scope.linkImg[1] = "assets/img/" + $scope.linkImgSet[1].split(",")[0] + "_off.png";
          $scope.linkTo[1] = $scope.linkImgSet[1].split(",")[1];
        } else {
          $scope.single_img = true;
          $scope.double_img = false;
          $scope.linkImgSet = rawText.split(",");
          $scope.linkImg[0] = "assets/img/" + $scope.linkImgSet[0] + ".gif";
          $scope.linkTo[0] = $scope.linkImgSet[1];
        }
      }
    };
    var init = function () {
      $scope.startscreen = true;
      $scope.bgm = new Audio('assets/sound/mangiad2.wav');
      $scope.bgm.play();
      $scope.bgm.loop = true;
    };
    init();
  }]);
