const { Client, query } = require("faunadb");

const fclient = new Client({
  secret: "SECRET",
});

const clg = console.log;
const cle = console.error;

const {
  CreateCollection,
  CreateFunction,
  CreateIndex,
  Paginate,
  Match,
  Lambda,
  Index,
  Create,
  Collection,
  Call,
  Function: Fn,
  Collections,
  Casefold,
  Query,
  Var,
  Concat,
  Modulo,
  Equals,
  If,
  ToNumber,
} = query;

const new_collection_name = "my_new_collection";

// Create Collection
fclient
  .query(CreateCollection({ name: new_collection_name }))
  .then(clg)
  .catch(cle);

// Get All Collections
fclient.query(Paginate(Collections())).then(clg).catch(cle);

// Create Document
fclient
  .query(
    Create(Collection(new_collection_name), { data: { value: "test value 1" } })
  )
  .then(clg)
  .catch(cle);

// Create Index to get specific fields
fclient
  .query(
    CreateIndex({
      name: "get_all_names",
      source: Collection("test_collection"),
      values: [{ field: ["data", "name"] }],
    })
  )
  .then(clg)
  .catch(cle);

fclient
  .query(Paginate(Match(Index("get_all_names"))))
  .then(clg)
  .catch(cle);

// Create Index for specific fields
fclient
  .query(
    CreateIndex({
      name: "get_all_names_by_divisibility",
      source: Collection("test_collection"),
      terms: [{ field: ["data", "divisibility_by_2"] }],
      values: [{ field: ["data", "name"] }],
    })
  )
  .then(clg)
  .catch(cle);

fclient
  .query(Paginate(Match(Index("get_all_names_by_divisibility"), "even")))
  .then(clg)
  .catch(cle);

// Create Index with operations
fclient
  .query(
    CreateIndex({
      name: "get_all_names_by_divisibility_",
      source: Collection("test_collection"),
      terms: [{ field: ["data", "divisibility_by_2"] }],
      values: [
        { field: ["data", "number_value"], reverse: true },
        { field: ["data", "name"] },
      ],
    })
  )
  .then(clg)
  .catch(cle);

fclient
  .query(
    Paginate(Match(Index("get_all_names_by_divisibility_"), Casefold("EVEN")))
  )
  .then(clg)
  .catch(cle);

// Create Function
fclient
  .query(
    CreateFunction({
      name: "create_entry",
      body: Query(
        Lambda(
          ["value"],
          Create(Collection("test_collection"), {
            data: {
              name: Concat(["test_value_", Var("value")]),
              number_value: ToNumber(Var("value")),
              divisibility_by_2: If(
                Equals(Modulo(ToNumber(Var("value")), 2), 0),
                "even",
                "odd"
              ),
            },
          })
        )
      ),
    })
  )
  .then(clg)
  .catch(cle);

fclient
  .query(Call(Fn("create_entry"), ["33"]))
  .then(clg)
  .catch(cle);
