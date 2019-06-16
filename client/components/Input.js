import React, { Component } from 'react';

const Input = (props) => {
  return (
    <div className="locInput">
      <label htmlFor={"loc" + props.keyName}>📍</label>
      <input type="text"
        id={"loc" + props.keyName}
        name={"loc" + props.keyName}
        onChange={props.onChange}
        placeholder={props.placeholder} />
    </div>
  );
};

export default Input;
