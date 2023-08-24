import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ReactNode, useMemo } from "react";
import LoginToken from "../utils/login-token";
import { ErrorResponse, onError } from "@apollo/client/link/error";
import { useError } from "./error.provider";

export default function CustomApolloProvider({
  children,
}: {
  children?: ReactNode;
}) {
  const { showError } = useError();

  const apolloClient = useMemo(() => {
    const httpLink = new HttpLink({
      uri: import.meta.env.VITE_HTTP_BACKEND_ENDPOINT,
    });

    const wsLink = new GraphQLWsLink(
      createClient({
        url: import.meta.env.VITE_WS_BACKEND_ENDPOINT,
        connectionParams: () => {
          const token = LoginToken.getToken();
          return {
            authorization: token ? `Bearer ${token}` : undefined,
          };
        },
      })
    );

    const authMiddleware = new ApolloLink((operation, forward) => {
      const token = LoginToken.getToken();
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return forward(operation);
    });

    const splitLink = split(
      ({ query }) => {
        const definition = query.definitions[0];
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    );

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([
        onError((error: ErrorResponse) => {
          if (error.graphQLErrors?.length) {
            showError(error.graphQLErrors[0].message);
          } else if (error.networkError) {
            showError("Connection error");
          }
        }),
        authMiddleware,
        splitLink,
      ]),
    });
  }, [showError]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
