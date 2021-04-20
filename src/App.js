import "./App.css";
import "rsuite/dist/styles/rsuite-default.css";
import { Button, ButtonToolbar, Modal } from "rsuite";
import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.textChange = this.textChange.bind(this);

    this.state = {
      show: false,
    };
  }
  textChange(event) {
    this.setState({
      show: this.state.show,
      textContent: event.target.value,
      titleContent: this.state.titleContent,
    });
  }
  titleChange(event) {
    this.setState({
      show: this.state.show,
      textContent: this.state.textContent,
      titleContent: event.target.value,
    });
  }

  close() {
    localStorage.setItem(this.state.titleContent, this.state.textContent);
    this.setState({ show: false });
  }

  open() {
    this.setState({
      show: true,
      textContent: "",
      titleContent: "",
    });
  }
  render() {
    return (
      <div className="App">
        <h1>Blog platform</h1>

        <ButtonToolbar>
          <Button appearance="primary">Home</Button>
          <Button onClick={this.open} color="orange">
            Create new blogpost
          </Button>
        </ButtonToolbar>

        <Modal show={this.state.show} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>Create new blogpost</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Article title</p>
            <textarea className="TitleText" onChange={this.titleChange}></textarea>
            <hr />
            <p>Article content</p>
            <textarea className="ContentText" onChange={this.textChange}></textarea>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close} appearance="primary">
              OK
            </Button>
            <Button onClick={this.close} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="ArticleContent">
          <BrowserRouter>
            {Object.keys(localStorage).map((key) => {
              return (
                <Route exact path={"/" + key}>
                  <div className="ArticleTitle">{key}</div>
                  <div className="ArticleText">{localStorage[key]}</div>
                </Route>
              );
            })}
          </BrowserRouter>
        </div>
        <div className="ArticleList">
          <BrowserRouter>
            {Object.keys(localStorage).map((key) => {
              return <Link to={"/" + key}>{key}</Link>;
            })}
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
