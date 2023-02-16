import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants';
import { timeDifferenceForDate } from '../utils';
import { FEED_QUERY } from './LinkList';
import { Edit, Trash } from '../icons/Icons';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const DELETE_LINK_MUTATION = gql`
  mutation DeleteMutation(
    $linkId: ID!
  ) {
    remove(linkId: $linkId) {
      id
    }
  }
`;

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const navigate = useNavigate();

  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdAt: 'desc' };

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    update: (cache, {data: {vote}}) => {
        const { feed } = cache.readQuery({
          query: FEED_QUERY,
          variables: {
            take,
            skip,
            orderBy
          }
        });
  
        const updatedLinks = feed.links.map((feedLink) => {
          if (feedLink.id === link.id) {
            return {
              ...feedLink,
              votes: [...feedLink.votes, vote]
            };
          }
          return feedLink;
        });
  
        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            feed: {
              links: updatedLinks
            }
          },
          variables: {
            take,
            skip,
            orderBy
          }
        });
      } 
  });

  const [deleteLink] = useMutation(DELETE_LINK_MUTATION, {
    variables: {
      linkId: link.id,
    },
    onCompleted: () => navigate('/top')
  })

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: 'pointer' }}
            onClick={vote}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {(
          <div onClick={() => console.log("onClick on text")} className="f6 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(link.createdAt)}{' '}
            <span onClick={() => navigate(`/update/${link.id}`)}><Edit /></span>{' '}
            <span onClick={() => { if (window.confirm("Are you sure! want to delete this link?")) deleteLink(); }} ><Trash/></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Link;