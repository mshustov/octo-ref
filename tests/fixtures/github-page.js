// comment
var hello = 'hello';
var world = 'world';
var mark = '!';

var options = {
    silent: true
};

/*
* a la jsdoc comment
*/
function greet(options, first, second){
    if (options.silent){
        return '...';
    }
    var local = [first, second, mark].join(' ');
    return local
}

greet = greet.bind(null, options);

['Alice', 'John'].forEach(function(name){
    console.log(name, 'said:', greet(hello, world));
})

[1,2,3].map(i => i + 1 );

