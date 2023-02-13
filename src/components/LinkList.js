import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from './Link';

export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
            id
            name
          }
          votes {
            id
            user {
              id
            }
          }
      }
    }
  }
`
;

const LinkList = () => {
  const { data } = useQuery(FEED_QUERY);

  React.useEffect(() => {
    console.log(data)
  })

  return (
    <div>
      {data && (
        <>
          {data.feed.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;