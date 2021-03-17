
function b() {
   const prom1=new Promise((resolve,rejected)=>{
    setTimeout(function () {
        let res1 = "first";
        resolve(res1);
       }, 1000);
   })
   
const prom2=new Promise((resolve,rejected)=>{
    setTimeout(function(){
        let res2="second"
        resolve(res2);
    },2000);
})
  

  return Promise.all([prom1,prom2])
//   return {
//     res1,
//     res2,
//   };
}

function a() {
    b().then((res)=>{
console.log(res);
    })
//   const result = b();
//   console.log(result);
}

a();
