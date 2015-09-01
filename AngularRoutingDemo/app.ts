

class App {
    static main() {
        angular
            .module("RouteDemo", ['ngRoute'])
            .controller("AppCtrl", AppCtrl)
            .config(this.ConfigRoutes)      
    }

    static ConfigRoutes($routeProvider: ng.route.IRouteProvider) {
        $routeProvider
            .when("/home", {
                action: "home.default"
            })
            .when("/range/:line/:column", {
                action: "range.line"
            })
            .when("/search/:term", {
                action: "search.term"
            })
            .when("/search/:term/select/:resultId", {
                action: "search.term.result"
            })
            .when("/search/:term/:resultId", {
                action: "search.term-result"
            })
            .when("/search/:term/:resultId/selection/:startLine/:startColumn?/:endLine?/:endColumn?", {
                action: "search.term-result.selection"
            })
            .when("/search/:term/:resultId/selection/:startLine/:startColumn?/:endLine?/:endColumn?/file/:filePath*", {
                action: "search.term-result.selection.file"
            })
            .when("/selection/:startLine/:startColumn?/:endLine?/:endColumn?/file/:filePath*", {
                action: "selection.file"
            })
            .when("/file/:filePath*", {
                action: "file"
            })
            //.when("/file/:filePath*\/selection/:startLine/:startColumn?/:endLine?/:endColumn?", {
            //    action: "file.selection"
            //})
    }
}

class AppCtrl {
    // alias services with 'any' type
    private _route: any;
    private _routeParams: any;

    constructor(
        private $scope: ng.IScope,
        private $route: ng.route.IRoute,
        private $routeParams: ng.route.IRouteParamsService 
        ) {
        this._route = $route;
        this._routeParams = $routeParams;

        this.addDemoUrls();
        this.listenToRouteChanges();
    }

    listenToRouteChanges() {
        this.$scope.$on("$routeChangeSuccess",
            ($currentRoute, $previousRoute) => {
                this.updateState();
            });
    }

    updateState() {
        var current = this._route.current;
        console.log("$route.current", current && current.$$route );
        console.log("$routeParams", this.$routeParams);
    }

    addDemoUrls() {
        (<any>this.$scope).demoUrls = [
            "#/home",
            "#/range/34/5",
            "#/search/graph",
            "#/search/graph/select/b683c837-9720-4cdd-b018-881c449fc528",
            "#/search/graph engine/select/21",
            "#/search/syntax node/21",
            "#/search/syntax node/21/selection/1",
            "#/search/syntax node/21/selection/1/2",
            "#/search/syntax node/21/selection/1/2/3/",
            "#/search/syntax node/21/selection/1/2/3/4",
            "#/search/syntax node/21/selection/1/2/3/4/file/src/roslyn/core/change.cs",
            "#/search/syntax node/21/selection/1/2/file/src/roslyn/core/change.cs",
            "#/selection/1/2/3/4/file/src/roslyn/core/change.cs",
            "#/selection/1/2/file/src/roslyn/core/change.cs",
            "#/file/src/roslyn/core/change.cs",
            //"#/file/src/roslyn/core/change.cs/selection/1/2/3/4/",
            //"#/file/src/roslyn/core/change.cs/selection",
        ];
    }
}


//$(() => App.main());
App.main();