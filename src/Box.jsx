import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';

function Box(props) {
  const { onclick, mark } = props;

  return <button type="button" onClick={onclick} className="box">{mark}</button>;
}

Box.propTypes = {
  onclick: PropTypes.func.isRequired,
  mark: PropTypes.string.isRequired,
};

export default Box;
