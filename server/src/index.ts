import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroConf from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/userResolver";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { EmContext } from "./types";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(mikroConf);
  await orm.getMigrator().up();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.log);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
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
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): EmContext => ({
      em: orm.em.fork(),
      req,
      res,
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
