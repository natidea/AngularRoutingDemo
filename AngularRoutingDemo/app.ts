

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
                action: "home.default", caseInsensitiveMatch: true
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
            .when("/search/:term/:resultId/selection/:startLine/:startColumn?/:endLine?/:endColumn?/references", {
                action: "search.term-result.selection.references"
            })
            .when("/search/:term/:resultId/selection/:startLine/:startColumn?/:endLine?/:endColumn?/references/file/:filePath*", {
                action: "search.term-result.selection.references.file"
            })
            .when("/selection/:startLine/:startColumn?/:endLine?/:endColumn?/references/file/:filePath*", {
                action: "selection.references.file", hasSelection: true
            })
            .when("/", {
                action: "noaction"
            })
            .otherwise({
                redirectTo: '/'
            })
    }
}

class AppCtrl {
    // alias services with 'any' type
    private _route: any;
    private _routeParams: any;

    constructor(
        private $scope: ng.IScope,
        private $route: ng.route.IRoute,
        private $routeParams: ng.route.IRouteParamsService,
        private $location: ng.ILocationService 
        ) {
        this._route = $route;
        this._routeParams = $routeParams;

        this.addDemoUrls();
        this.listenToRouteChanges();

        this._scope().ChangeUrlAsync = () => {
            console.log("changing");
            $location.path("/range/34/5");
        };

        this._scope().time = 100;
        setInterval(() => {
            this._scope().time++;
            $scope.$digest();
        }, 1000);
    }

    listenToRouteChanges() {
        this.$scope.$on("$routeChangeSuccess",
            ($currentRoute, $previousRoute) => {
                this.updateState();
            });
    }

    private _scope(): any {
        return this.$scope;
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
            "#/file/src/roslyn/core/change.cs?startLine=1&startColumn=2&endLine=3&endColumn=4",
            //"#/file/src/roslyn/core/change.cs/selection/1/2/3/4/",
            //"#/file/src/roslyn/core/change.cs/selection",
            "#/search/syntax node/21/selection/1/2/3/4/references",
            "#/search/syntax node/21/selection/1/2/3/references",
            "#/search/syntax node/21/selection/1/2/references/file/src/roslyn/core/change.cs",
            "#/selection/1/2/3/4/references/file/src/roslyn/core/change.cs",
        ];
    }
}


//$(() => App.main());
App.main();