import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";

const UPDATE_LINK_MUTATION = gql`
  mutation UpdateMutation(
    $linkId: ID!
    $description: String!
    $url: String!
  ) {
    update(linkId: $linkId, description: $description, url: $url) {
      id
      url
      description
    }
  }
`;

export default function UpdateLink() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathParams = location.pathname.split('/');
    const [formState, setFormState] = React.useState({
        description: '',
        url: '',
    })
    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
          linkId: pathParams[pathParams.length - 1],
          description: formState.description,
          url: formState.url
        },
        onCompleted: () => navigate('/')
    })

    return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value
              })
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value
              })
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
    )
}