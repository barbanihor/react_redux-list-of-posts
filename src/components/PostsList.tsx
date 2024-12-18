/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React from 'react';
import { selectPosts } from '../features/post/postsSlice';
import { useSelector } from 'react-redux';
import {
  selectSelectedPost,
  setSelectedPost,
} from '../features/selectedPost/selectedPostSlice';
import { useAppDispatch } from '../app/hooks';
import { Post } from '../types/Post';

export const PostsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const posts = useSelector(selectPosts);
  const selectedPost = useSelector(selectSelectedPost);

  const onPostSelected = (post: Post | null) => {
    dispatch(setSelectedPost(post));
  };

  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>

      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts.map(post => (
            <tr key={post.id} data-cy="Post">
              <td data-cy="PostId">{post.id}</td>
              <td data-cy="PostTitle">{post.title}</td>
              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={classNames('button', 'is-link', {
                    'is-light': post.id !== selectedPost?.id,
                  })}
                  onClick={() => {
                    onPostSelected(post.id === selectedPost?.id ? null : post);
                  }}
                >
                  {post.id === selectedPost?.id ? 'Close' : 'Open'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
