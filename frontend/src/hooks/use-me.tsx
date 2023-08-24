import { gql, useQuery } from "@apollo/client";
import { User } from "../gql/graphql";

const GET_ME = gql`
  query getMe {
    me {
      id
      avatar
      displayName
      guildId
      guildName
      guildIcon
    }
  }
`;

const useMe = () => {
  const { data } = useQuery<{ me: User }>(GET_ME);

  return { me: data?.me };
};

export default useMe;
