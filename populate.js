const fclient = require("./0_connection.js");
const { Create, Collection, CreateCollection } = require("faunadb").query;

const range = 20;
const test_collection_name = "test_collection";

fclient
  .query(CreateCollection({ name: test_collection_name }))
  .then(console.log)
  .catch(console.error);

for (let i = 0; i < range; i++) {
  fclient.query(
    Create(Collection(test_collection_name), {
      data: {
        name: `test_data_name_${i}`,
        number_value: i,
        divisibility_by_2: i % 2 === 0 ? "even" : "odd",
      },
    })
  ).then(console.log)
      .catch(console.error);
}
