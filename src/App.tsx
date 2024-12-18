import React, { useEffect } from 'react';
import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { useSelector } from 'react-redux';
import {
  clearPosts,
  loadUserPostsAsync,
  selectHasError,
  selectLoaded,
  selectPosts,
  setLoaded,
} from './features/post/postsSlice';
import { loadUsersAsync } from './features/users/usersSlice';
import {
  selectSelectedPost,
  setSelectedPost,
} from './features/selectedPost/selectedPostSlice';
import { selectAuthor } from './features/author/authorSlice';
import { useAppDispatch } from './app/hooks';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const posts = useSelector(selectPosts);
  const loaded = useSelector(selectLoaded);
  const hasError = useSelector(selectHasError);
  const author = useSelector(selectAuthor);
  const selectedPost = useSelector(selectSelectedPost);

  function loadUserPosts(userId: number) {
    dispatch(setLoaded(false));
    dispatch(loadUserPostsAsync(userId));
  }

  useEffect(() => {
    dispatch(loadUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    // we clear the post when an author is changed
    // not to confuse the user
    dispatch(setSelectedPost(null));

    if (author) {
      loadUserPosts(author.id);
    } else {
      dispatch(clearPosts());
    }
  }, [author]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector />
              </div>

              <div className="block" data-cy="MainContent">
                {!author && <p data-cy="NoSelectedUser">No user selected</p>}

                {author && !loaded && <Loader />}

                {author && loaded && hasError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {author && loaded && !hasError && posts.length === 0 && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {author && loaded && !hasError && posts.length > 0 && (
                  <PostsList />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && <PostDetails />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
