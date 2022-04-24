import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/userResolver";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { AppContext } from "./types";
import cors from "cors";
import { AppDataSource } from "./DataSource";
import { UpdootResolver } from "./resolvers/updootResolver";
import { createUserDataloader } from "./utils/createUserDataloader";
import { createUpdootDataloader } from "./utils/createUpdootDataloader";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 3600 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
      },
      secret: "eldecogreens",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver, UpdootResolver],
      validate: false,
    }),
    context: ({ req, res }): AppContext => ({
      req,
      res,
      redis,
      userLoader: createUserDataloader(),
      updootLoader: createUpdootDataloader(),
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("listening on port 4000");
  });
};

main();
