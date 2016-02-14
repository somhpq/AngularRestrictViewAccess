(
    function(){
        var module = angular.module('viewAccess',['ui.router']);
        
        // route
        var state = function(state, urlRouter){
            urlRouter.otherwise('/home')
            state
            .state('home',{url: '/home', templateUrl: 'home.html'})
            .state('secret',{url: '/secret', templateUrl: 'secret.html', controller: 'secretController'})
            .state('auth',{url: '/auth', templateUrl: 'authorizedView.html', controller: 'authController'})
            .state('unAuth',{url: '/unAuth', templateUrl: 'unAuthorizedView.html', controller: 'unAuthController'})
            ;
        }
        state.$inject = ['$stateProvider', '$urlRouterProvider'];
        module.config(state);
        
        
        // service
        var service = function() {
            var secretViewAccess = false;
            var readSecretAccess = function(){return secretViewAccess;}
            var setSecretAccess = function(){secretViewAccess = true;}
            var clearSecretAccess = function(){secretViewAccess = false;}
            
            return {
                clearSecretViewAccess: clearSecretAccess
                ,setSecretViewAccess: setSecretAccess
                ,readSecretViewAccess: readSecretAccess
            }
        }
        module.factory('authService', service);
        
        
        // unauthorized
        var unAuthController = function(model, state, authService){
            // NOT set secret view access
            //authService.setSecretViewAccess();
            
            // route to Secret view
            model.toSecretView = function(){
                state.go('secret');
            }
        }
        unAuthController.$inject = ['$scope', '$state', 'authService'];
        module.controller('unAuthController', unAuthController);
        
        
        // authorized
        var authController = function(model, state, authService){
            // route to Secret view
            model.toSecretView = function(){
                // set secret view access
                authService.setSecretViewAccess();
                
                state.go('secret');
            }
        }
        authController.$inject = ['$scope', '$state', 'authService'];
        module.controller('authController', authController);
        
        
        // secret
        var secretController = function(model, state, authService){
            var isAuthorized = authService.readSecretViewAccess();
            
            // reject to home view if not authorize
            if(!isAuthorized){
                state.go('home');
            }
            else {
                authService.clearSecretViewAccess();
            }
        }
        secretController.$inject = ['$scope', '$state', 'authService'];
        module.controller('secretController', secretController);
        
    }()
)