## Sources
to integrate typeorm and generate migrations

https://dev.to/amirfakour/using-typeorm-migration-in-nestjs-with-postgres-database-3c75




Technical 

- Start from a boiler plate with simple database: 
-postgre /Typeorm/express//jest

```js
const carbonEmissionFactors = [
  {
    Name: "ham",
    unit: "kg",
    valueInKgCO2: 0.12,
    source: "Agrybalise",
  },
  {
    name: cheese,
    unit: "kg",
    valueInKgCO2: 0.12,
    source: "Agrybalise",
  },
  {
    name: tomato,
    unit: "kg",
    valueInKgCO2: 0.12,
    source: "Agrybalise",
  },
  {
    name: oliveOil,
    unit: l,
    valueInKgCO2: 0.12,
    source: "Agrybalise",
  },
];

```


When working on the following exercise, give particular attention to the following points:
Readability of your code
Unit Testing
Architecture and organization of your functions  
Handling of corner cases and errors
Overall performance of your code

1/ Create an endpoint to compute carbonFootprint of food and persist data in database.
```js
const hamCheesePizza = {
  ingredients: [
    { name: "ham", value: "2", unit: "g" },
    { name: "cheese", value: "15", unit: "g" },
    { name: "tomato", value: "4", unit: "g" },
    { name: "floor", value: "7", unit: "g" },
    { name: "oliveOil", value: "0.7", unit: "l" },
  ],
};
```
2/Agrybalise has updated its coefficients and we want to update accordingly our knowledge base. In order to do that, we need to develop and endpoint allowing to update and/or insert new values in our referential of emission factors.

In particular, we want to add these values:














Test Criterion for technical test:
Problem solving solution: should solve efficiently the problem
Clean code aspects: readability (naming, architecture), test
Performance of code & algorithmic
Knowledge of database
Error handling & exceptions

Test Criterion for technical test:
Clarity of explanation of approach and database
General engineering culture
Reactivity on advices & inputs
 



Questions:



2/ 

Fonction buggé


Performance

Asynchronous feature
Utiliser un ORM
Rest API
Base de donnée 

Bonus:
authentification
