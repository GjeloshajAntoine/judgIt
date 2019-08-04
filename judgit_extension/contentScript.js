console.log('contentscipt#');

//console.log(document.querySelectorAll('a'));

document.querySelectorAll('a').forEach(e=> {
    fetch('localhost:3000/votes/colorTotal/'+e.href)
    .then(res=>{
        return res.json()
    })
    .then(colors=>{
        e.addEventListener('mouseover', function () {
            this.style.backgroundImage = colorLineGraph(colors.green,colors.yellow,colors.red)
            // this.style.backgroundImage = 'linear-gradient(transparent, transparent),linear-gradient(transparent, transparent),linear-gradient(to right, #30e8bf, #F90F00)'
        })
        e.addEventListener('mouseout',function () {
            this.style.backgroundImage = ''
        })
    })
    
})


function colorLineGraph(green,yellow,red) {
    return 'linear-gradient(transparent, transparent),linear-gradient(transparent, transparent),linear-gradient(to right, #30e8bf, #F90F00)'
}