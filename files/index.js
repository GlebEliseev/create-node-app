import './style.css'

let arr = [1, 2, 3, 4].reduce((acc, curr) => acc + curr)
alert('This result is compiled to browser compatible JS: ' + arr)
