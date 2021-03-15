import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';

function Box(props) {
  const { onclick, mark, testid } = props;

  return (
    <button
      data-testid={testid}
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
  testid: PropTypes.string.isRequired,
};

export default Box;
