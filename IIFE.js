for (var i=0;i<3;i++) {
    (function(j) {
        setTimeout(() => {
            console.log(j)
        }, 0);
    })(i)
}