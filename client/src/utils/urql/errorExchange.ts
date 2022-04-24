import Router from "next/router";
import { Exchange } from "urql";
import { pipe, tap } from "wonka";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.toLowerCase().includes("not authenticated")) {
          const return_to = Router.pathname;
          const redirect = return_to === "/" ? Router.push : Router.replace;

          redirect({ pathname: "/auth/login", query: { return_to } });
        }
      })
    );
  };

export { errorExchange };
