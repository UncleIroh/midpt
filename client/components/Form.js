import React, { Component } from 'react';
import Input from '../components/Input';

// Handles selecting "other"s radio button when selecting its text input
const selectOnInput = (callback) => {
  document.getElementById('other').checked = true;
  callback();
};

const Form = (props) => {
  return (
    <form id="form">
      <div className="locInputs">
        <Input key="a" keyName="a" onChange={props.onChange} placeholder={props.placeholder} />
        <Input key="b" keyName="b" onChange={props.onChange} placeholder={props.placeholder} />
      </div>
      <div className="locButtons">
        <div className="timeRadio">
          <span>Leaving</span>
          <input type="radio" name="leaving" id="now" value="now" onClick={props.onRadioChange} />
          <label htmlFor="now">Now</label>
          <input type="radio" name="leaving" id="p30min" value="p30min" onClick={props.onRadioChange} defaultChecked="true" />
          <label htmlFor="p30min">{'In 30 mins'}</label>
          <input type="radio" name="leaving" id="p1hr" value="p1hr" onClick={props.onRadioChange} />
          <label htmlFor="p1hr">{'In 1 hour'}</label>
          <input type="radio" name="leaving" id="other" value="other" onClick={props.onRadioChange} />
          <label htmlFor="other">
            <input type="text" id="otherText" placeholder="Other..." onClick={() => selectOnInput(props.onRadioChange)} />
          </label>
        </div>
        <input type="button" value="Find Midpoint →" onClick={props.onClick} />
      </div>
    </form>
  );
};

export default Form;
