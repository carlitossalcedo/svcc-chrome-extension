import React from 'react';
import Footer from './footer';
import './options.css';

const timezones = {
  'Eastern': 'America/New_York',
  'Central': 'America/Chicago',
  'Mountain': 'America/Denver',
  'Pacific': 'America/Los_Angeles',
  'GMT': 'Etc/GMT'
};

export default class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {symbols: [], timezone: '', interval: ''};
    this._saveOptions = this.saveOptions.bind(this);
    this._addItem = this.addItem.bind(this);
    this._removeItem = this.removeItem.bind(this);
    chrome.runtime.sendMessage({action: 'getOptions'}, function(response) {
      this.setState(response);
    }.bind(this));
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  //add item to list
  addItem(e) {
    e.preventDefault();
    let newValue = document.getElementById('symbol').value.toString().toUpperCase().trim();
    if(newValue) {
      this.setState({symbols: this.state.symbols.concat(newValue)});
    }
  }

  //remove item from list
  removeItem(e) {
    e.preventDefault();
    let index = e.target.dataset.index;
    let temp = this.state.symbols;
    temp.splice(index, 1);
    this.setState({symbols: temp});
  }

  getFieldValue(name, isArray = false) {
    if(isArray) {
      return [].filter.call(document.getElementsByName(name), c => c.checked).map(c => c.value);
    }
    else {
      let e = document.getElementsByName(name)[0];
      return e.options[e.selectedIndex].value;
    }
  }

  saveOptions(e) {
    e.preventDefault();
    let options = {
      symbols: this.state.symbols,
      timezone: this.getFieldValue('timezone'),
      interval: this.getFieldValue('interval')
    };
    console.dir(options);
    chrome.runtime.sendMessage({action: 'optionsChanged', options: options}, () => window.close());
  }

  showForm() {
    return (
      <form>
        <table>
          <tbody>
            <tr>
              <td>
                <legend>Choose stock symbols</legend>
                <p/>
                <div>
                  <input type="text" id="symbol" />
                  <button onClick={this._addItem}>Add</button>
                </div>
                <p/>
                {
                  this.state.symbols.map((item, index) =>
                    <div className="item" key={item+index}>
                      <span data-index={index} className="btnDelete" onClick={this._removeItem}></span>
                      {index + 1}. {item}
                    </div>
                  )
                }
              </td>
              <td>
                <legend>Choose update times</legend>
                <p/>
                <label htmlFor="timezone">Results time zone:</label>&nbsp;
                <select name="timezone" value={this.state.timezone} onChange={this.handleChange}>
                {
                  Object.keys(timezones).map((tz, i) => <option key={i} value={timezones[tz]}>{tz}</option>)
                }
                </select>
                <p/>
                <label htmlFor="interval">Update interval:</label>&nbsp;
                <select name="interval" value={this.state.interval} onChange={this.handleChange}>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">Hour</option>
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="bottom">
                <button onClick={this._saveOptions}>Save</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="header">
          <img src="../icons/svcc.png" width="48" height="48" />
          <span>&nbsp;SpotChecker Options Page</span>
        </div>
        <div>{this.showForm()}</div>
        <Footer size="large" />
      </div>
    );
  }
}
