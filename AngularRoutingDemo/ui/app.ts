

class AppUI {
    static main() {
        angular
            .module("RouteDemo", ['ui.router'])
            .controller("AppCtrl", AppCtrlUI)
            .config(this.ConfigRoutes)      
    }

    static ConfigRoutes(
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $urlMatcherFactoryProvider: ng.ui.IUrlMatcherFactory) {

        $urlRouterProvider.otherwise("/");
        $urlMatcherFactoryProvider.caseInsensitive(true);

        var fileParams = "l&sl&el&sc&ec&reference";

        $stateProvider
            .state("root", {
                url: "/",
            })
            .state("project", {
                url: "/:projectName?version&account"
            })
            .state("project.search", {
                url: "/search/:term?resultId", data: { hasSearch: true }
            })
            .state("project.file", {
                url: "/file/*path?" + fileParams
            })
            .state("project.search.file", {
                url: "/file/*path?" + fileParams
            })
            .state("project.s", {
                url: "/s/:term?resultId", 
                redirectTo: "project.search"
            })
            //.state("project.path", {
            //    url: "/*path?" + fileParams, reloadOnSearch: true
            //})
            //.state("project.search.path", {
            //    url: "/*path?" + fileParams
            //})
    }
}

class AppCtrlUI {

    addDemoUrls() {
        (<any>this.$scope).demoUrls = [
            // default
            "#/",

            // project
            "#/roslyn",
            "#/roslyn?resultId=42", // ignored parameter
            "#/roslyn?version=abcde&account=dotnet",

            // project.search
            "#/coby/search/graph",
            "#/coby/search/graph?resultId=32",
            "#/coby/search/graph?resultId=33",
            "#/coby/search/graph?resultId=32&version=zyxwv&account=dotnet",

            // project.file
            "#/coby/file/src/roslyn/core/change.cs",
            "#/coby/file/src/roslyn/core/change.cs?l=21",
            "#/coby/file/src/roslyn/core/change.cs?l=21-34",
            "#/coby/file/src/roslyn/core/change.cs?sl=23&el=2&sc=42&ec=4",

            // project.search.file
            "#/coby/search/graph/file/src/roslyn/core/change.cs",
            "#/coby/search/graph/file/src/roslyn/core/change.cs?resultId=32",
            "#/coby/search/graph/file/src/roslyn/core/change.cs?resultId=123&sl=23&el=2&sc=42&ec=4",

            //// project.path
            //"#/coby/src/roslyn/core/change.cs",
            //"#/coby/src/roslyn/core/change.cs?l=21",
            //"#/coby/src/roslyn/core/change.cs?l=21-34",
            //"#/coby/src/roslyn/core/change.cs?sl=23&el=2&sc=42&ec=4",

            //// project.search.path
            //"#/coby/search/graph/src/roslyn/core/change.cs",
            //"#/coby/search/graph/src/roslyn/core/change.cs?resultId=32",
            //"#/coby/search/graph/src/roslyn/core/change.cs?resultId=123&sl=23&el=2&sc=42&ec=4",
        ];
    }

    // alias services with 'any' type
    private _state: any;
    private _stateParams: any;

    constructor(
        private $scope: ng.IScope,
        private $state: ng.ui.IStateService,
        private $stateParams: ng.ui.IStateParamsService,
        private $location: ng.ILocationService 
        ) {
        this._state = $state;
        this._stateParams = $stateParams;

        this.addDemoUrls();
        this.listenToRouteChanges();
        this.setupChangeButtons();

        this.setupTimer();
    }

    setupChangeButtons() {

        this._scope().LoadUrl = (url: string) => {
            console.log("loading url");
            this.$location.path(url.substring(1));
        };

        this._scope().ChangeUrlAsync = () => {
            console.log("changing");
            //this.$location.path("/coby/search/graph?resultId=322");
            //this.$state.go("project.file", {path: "src/analyzers/FxCop.cs"});
            this.$state.go("project.search", { resultId: "872" }, { notify: false });
        };
    }

    setupTimer() {
        this._scope().time = 100;
        setInterval(() => {
            this._scope().time++;
            this.$scope.$digest();
        }, 1000);
    }

    listenToRouteChanges() {
        this.$scope.$on("$stateChangeStart",
            (event, toState, toParams, fromState, fromParams) => {
                console.log("Entering State: ", toState.name);
                if (toState.redirectTo) {
                    event.preventDefault();
                    this.$state.go(toState.redirectTo, toParams);
                }
            });

        this.$scope.$on("$stateChangeSuccess",
            (event, toState, toParams, fromState, fromParams) => {
                console.log("toState", toState);
                console.log("toParams", toParams);
                //console.log("$stateParams", this.$stateParams);
                if (this.$state.includes("**.search.**")) console.info("searching...");
                if (this.$state.includes("**.file.**")) console.info("opening file...");
            });
    }

    private _scope(): any {
        return this.$scope;
    }

    updateState() {
        var current = this._state.current;
        console.log("$route.current", current && current.$$route );
        //console.log("$routeParams", this.$routeParams);
    }
}


//$(() => App.main());
AppUI.main();