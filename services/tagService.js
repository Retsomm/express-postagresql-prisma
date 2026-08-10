import * as tagRepository from '../repositories/tagRepository.js';

export const getTags = () => {
  return tagRepository.findManyTags();
};

export const createNewTag = ({ name }) => {
  return tagRepository.createTag({ name });
};
