Template.registerHelper('session',function(input){
    return Session.get(input);
});

Template.registerHelper('fixed3', (x)=>{
    return x.toFixed(3)
});
