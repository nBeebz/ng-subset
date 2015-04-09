(function(){
	var  app = angular.module('subset', []);

	app.controller('SubsetController', function($scope, $http) {
		$scope.tab = 1;
		$scope.loggedIn = false;

		$scope.selectTab = function(t){
			$scope.tab = t;
		};

		$scope.isSelected = function(t){
			return $scope.tab === t;
		};

		$scope.getUser = function(){
			

			var tab = 1;
			var id = $("#user").val();
			var pass = $("#pwd").val();
			
			var url = "http://subset.navbhatti.com/api/students" + "/" + id;

			$http.get( url )
			.success(function(user) {
				if(user.password == pass ){
					$scope.user =  parseUser(user);
					$scope.loggedIn = true;
					$scope.getData();
					$scope.selectTab(2);
				}
			});
		};

		$scope.getData = function(){
			var url = "http://subset.navbhatti.com/api/";
			$http.get( url + "courses" )
			.success(function(courses) {
				$scope.courses = [];
				var i = 0
				for( idx in courses )
				{
					course = courses[idx];
					if($.inArray(course.id, $scope.user.courses)){
						$scope.courses[i++] = parseCourse(course);
					}
				}
			});	
		};

		$scope.showCourse = function(idx){
			var url = "http://subset.navbhatti.com/api/";
			$scope.activeCourse = $scope.courses[idx];
			$http.get( url + "news" )
			.success(function(news) {
				$scope.news = [];
				var i = 0
				for( idx in news )
				{
					newsItem = news[idx];
					if( newsItem.course == $scope.activeCourse["id"] ){
						$scope.news[i++] = newsItem;
					}
				}
				$scope.selectTab(3);
			});
		};

		$scope.postNews = function(){
			var title = $("#title").val();
			var content = $("#content").val();
			var data ={
				"time": new Date(),
				"title": title,
				"news1": content,
				"course": $scope.activeCourse.id,
				"name": $scope.user.name
			};
			$http.post('http://subset.navbhatti.com/api/news', JSON.stringify(data)).success(function(){$scope.selectTab(2);});
			
		};

		function parseUser(user){ user["courses"] = JSON.parse(user["courses"]); return user; }
		function parseCourse(course){ 
			course["hours"] = JSON.parse(course["hours"]); 
			course["marks"] = JSON.parse(course["marks"]);
			return course;
		}

	});


})();

