Vue.component('signup',{
	template:'#signup'
})
Vue.component('registration',{
	template:'#registration'
})
new Vue({
	el: "#signup-elem",
	data:{
  	current:"signup",
    reg: false
  },
  methods:{
  	toRegistration:function(){
    	this.reg = true,
    	this.current = 'registration'
    },
    toHome: function(){
    	this.current = 'signup',
      this.reg = false;
    },
  },
  components:['signup','registration'], 
})

//Vue.component('signup',{
//    template:'#signup'
//})
//Vue.component('registration',{
//    template:'#registration'
//})
//var userLogin = new Vue({
//	el: "signup-elem",
//    data:{
//	  	current:"signup",
//		reg: false
//    },
//    methods:{
//  		toRegistration:function(){
//   	    	this.reg = true,
//   	    	this.current = 'registration'
//		},
//		toHome: function(){
//   	    	this.current = 'signup',
//	    	this.reg = false;
//		},
//    },
//    components:['signup','registration'], 
//})

//userLogin === document.getElementById('aquaint-login')
