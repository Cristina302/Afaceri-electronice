const obj = {
    name: "Cristina",
    greet: function () {
        //console.log("Hello, " + this.name);
        console.log(`Hello, ${this.name}`);
    },
    greet2: () => {
        console.log(`Hello, ${this.name}`)
    }
}

obj.name = "Mihai"
obj.age=26
//delete onrejectionhandled.greet2;
//obj.greet2()
//console.log(obj.age);

const product = {
    price: 25,
    name: "Bottle",
    description: "Aqua Carpatica"
}

const product2 = {
    ...product,
    price:30
}

console.log(product2);