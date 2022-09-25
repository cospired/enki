import PropTypes from 'prop-types';

export const translationShape = PropTypes.shape({
  message: PropTypes.string,
  createdAt: PropTypes.number.isRequired,
  updatedAt: PropTypes.number.isRequired,
  deletedAt: PropTypes.number,
  fuzzy: PropTypes.boolean,
  inheritFrom: PropTypes.arrayOf(PropTypes.string),
  whitelist: PropTypes.boolean
});

export const messageShape = PropTypes.shape({
  id: PropTypes.string.isRequired, // check uniquness
  description: PropTypes.string,
  defaultMessage: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    file: PropTypes.string,
    start: PropTypes.shape({
      line: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }),
    end: PropTypes.shape({
      line: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }),
    createdAt: PropTypes.number.isRequired,
    updatedAt: PropTypes.number.isRequired,
    deletedAt: PropTypes.number
  }).isRequired,
  translations: PropTypes.objectOf(translationShape).isRequired
});
