import Router from "next/router";
import { Exchange } from "urql";
import { pipe, tap } from "wonka";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        console.log(error);
        if (error?.message.toLowerCase().includes("not authenticated")) {
          Router.replace("/auth/login");
        }
      })
    );
  };

export { errorExchange };
