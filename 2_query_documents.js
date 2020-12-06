const { Client, query } = require("faunadb");

// E-commerce
const fclient = new Client({
  secret: "SECRET",
});

const clg = console.log;
const cle = console.error;

const {
  CreateIndex,
  Paginate,
  Match,
  Lambda,
  Index,
  Collection,
  Var,
  Equals,
  Get,
  Ref,
  Update,
  Reduce,
  Map,
  Filter,
  Delete,
  Documents,
  Select,
  Let,
  Append,
} = query;

// Get a document
fclient
  .query(Get(Ref(Collection("customers"), "284180381919347202")))
  .then(clg)
  .catch(cle);

fclient
  .query(Paginate(Match(Index("all_customers"))))
  .then(clg)
  .catch(cle);

fclient
  .query(
    CreateIndex({
      name: "customer_by_first_name",
      source: Collection("customers"),
      terms: { field: ["data", "firstName"] },
    })
  )
  .then(clg)
  .catch(cle);

fclient
  .query(Get(Match(Index("customer_by_first_name"), "Auria")))
  .then(clg)
  .catch(cle);

// Update a Document
fclient
  .query(
    Update(Ref(Collection("customers"), "284180381919347202"), {
      data: { telephone: "123" },
    })
  )
  .then(clg)
  .catch(cle);

fclient
  .query(Get(Match(Index("customer_by_first_name"), "Auria")))
  .then(clg)
  .catch(cle);

// Delete a document
fclient
  .query(Delete(Ref(Collection("customers"), "284180381919347202")))
  .then(clg)
  .catch(cle);

fclient
  .query(Paginate(Match(Index("all_customers"))))
  .then(clg)
  .catch(cle);

// Advanced query
fclient
  .query(
    Let(
      { customerId: "284180381939270146" },
      Let(
        {
          orders: Filter(
            Map(
              Paginate(Documents(Collection("orders"))),
              Lambda("orderRef", Get(Var("orderRef")))
            ),
            Lambda(
              ["order"],
              Equals(
                Select(["data", "customer"], Var("order")),
                Ref(Collection("customers"), Var("customerId"))
              )
            )
          ),
        },
        Reduce(
          Lambda((acc, value) => Append(acc, Select(["data", "line"], value))),
          [],
          Var("orders")
        )
      )
    )
  )
  .then((res) => clg(JSON.stringify(res, null, 2)))
  .catch(cle);
