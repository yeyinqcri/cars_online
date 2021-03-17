const obj = {
  foo: 21,
  bar: function () {
    setTimeout(() => {
      console.log(this.foo);
    }, 3000);
  },
};
obj.bar();
