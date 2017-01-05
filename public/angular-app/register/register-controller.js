angular.module('meanhotel').controller('RegisterController', RegisterController);

function RegisterController($http) {
  var vm = this;
  vm.username = '';
  vm.password = '';
  vm.register = () => {
    var user = {
      username: vm.username,
      password: vm.password
    };

    if(!vm.username || !vm.password) {
      vm.error = 'Please add a username and a password';
    } else {
      if(vm.password !== vm.passwordRepeat) {
        vm.error = 'Please make sure the passwords match';
      } else {
        $http.post('/api/users/register', user).then(result => {
          console.log(result);
          vm.message = 'Successful registration, please login';
          vm.error = '';
        }).catch(err => {
          console.log(err);
        });
      }
    }
  };
}