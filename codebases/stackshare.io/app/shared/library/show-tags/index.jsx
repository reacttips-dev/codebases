import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import EditTags from './edit-tags';
import AllTags from './all-tags';
import {ApolloContext} from '../../enhancers/graphql-enhancer';
import {TaggingContext} from '../../enhancers/all-tags';
import {replaceTags} from '../../../shared/enhancers/all-tags';

const ShowTags = ({isSidebar}) => {
  const client = useContext(ApolloContext);
  const taggingContext = useContext(TaggingContext);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(taggingContext.tags);

  const saveTags = async newTags => {
    setLoading(true);
    await client.mutate({
      mutation: replaceTags,
      variables: {
        id: taggingContext.id,
        tags: newTags,
        objectType: taggingContext.objectType
      }
    });
    setLoading(false);
    setTags(newTags);
    setEditMode(false);
  };

  return editMode ? (
    <EditTags
      saveTags={saveTags}
      tags={tags}
      loading={loading}
      setEditMode={setEditMode}
      isSidebar={isSidebar}
    />
  ) : (
    <AllTags tags={tags} setEditMode={setEditMode} />
  );
};

ShowTags.propTypes = {
  isSidebar: PropTypes.bool
};

ShowTags.defaultProps = {
  isSidebar: false
};

export default ShowTags;
