import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';

function Box(props) {
  const { onclick, mark } = props;

  return (
    <button
      href="#"
      type="button"
      className="column tile is-one-third is-clickable"
      onClick={onclick}
    >
      {mark}
    </button>
  );
}

Box.propTypes = {
  onclick: PropTypes.func.isRequired,
  mark: PropTypes.string.isRequired,
};

export default Box;
