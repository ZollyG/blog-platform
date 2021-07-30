import "./App.css";
import "rsuite/dist/styles/rsuite-default.css";
import { Button, ButtonToolbar, Modal, Alert } from "rsuite";
import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.textChange = this.textChange.bind(this);
    this.closeNoResult = this.closeNoResult.bind(this);
    this.nukeLocal = this.nukeLocal.bind(this);
    this.commentSubmit = this.commentSubmit.bind(this);
    this.commentChange = this.commentChange.bind(this);

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

  commentChange(event) {
    this.setState({
      commentContent: event.target.value,
    });
  }

  nukeLocal() {
    Alert.error("localStorage has been nuked!");
    localStorage.clear();
    this.forceUpdate();
  }

  close() {
    Alert.success("Article Posted!");
    localStorage.setItem(
      this.state.titleContent,
      JSON.stringify({
        textContent: this.state.textContent,
        comments: JSON.stringify([]),
      })
    );
    this.setState({ show: false });
  }

  commentSubmit(key) {
    if (!this.state.commentContent) {
      Alert.error("No comment posted!");
      return;
    }
    let articleContent = JSON.parse(localStorage[key]).textContent;
    let commentsContent = JSON.parse(JSON.parse(localStorage[key]).comments);
    commentsContent.push(this.state.commentContent);
    localStorage.setItem(
      key,
      JSON.stringify({
        comments: JSON.stringify(commentsContent),
        textContent: articleContent,
      })
    );

    this.setState({ commentContent: "" });
  }

  closeNoResult() {
    Alert.warning("No article posted!");
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
    document.body.style = "background-color: lightgrey";
    return (
      <div className="App">
        <Helmet>
          <title>blog-platform</title>
        </Helmet>
        <BrowserRouter>
          <div className="ButtonsAndTitle">
            <div className="WebTitle">Blog platform</div>
            <ButtonToolbar className="Buttons">
              <Button appearance="primary">
                <Link className="LinkHome" to={"/"}>
                  Home
                </Link>
              </Button>
              <Button onClick={this.open} color="orange">
                Create new blogpost
              </Button>
              <Button color="red" onClick={this.nukeLocal}>
                Delete all blogposts
              </Button>
            </ButtonToolbar>
          </div>
          <Modal show={this.state.show} onHide={this.closeNoResult}>
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
              <Button
                onClick={() => {
                  this.close();
                }}
                appearance="primary"
              >
                OK
              </Button>
              <Button onClick={this.closeNoResult} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="ArticleZone">
            <div className="ArticleContent">
              <Switch>
                {Object.keys(localStorage).map((key) => {
                  return (
                    <Route exact path={"/" + key}>
                      <h1 className="ArticleTitle">{key}</h1>
                      <div className="ArticleText">
                        {JSON.parse(localStorage[key]).textContent}
                      </div>
                      <div className="CommentSection">
                        <h3>Comments</h3>
                        {JSON.parse(JSON.parse(localStorage[key]).comments).map(
                          (comm) => {
                            return <div className="Comment">{comm}</div>;
                          }
                        )}
                      </div>
                      <div className="CommentSubmit">
                        <h3>Leave a comment</h3>
                        <textarea
                          id="CommentInput"
                          placeholder="Write your comment here"
                          onChange={this.commentChange}
                        ></textarea>
                        <Button
                          className="SubmitButton"
                          onClick={() => {
                            this.commentSubmit(key);
                          }}
                          appearance="primary"
                        >
                          Submit
                        </Button>
                      </div>
                    </Route>
                  );
                })}
                <Route>
                  <h1 className="ArticleTitle">Pick an article</h1>
                </Route>
              </Switch>
            </div>

            <div className="ArticleList">
              <h3>Other articles</h3>
              {Object.keys(localStorage).map((key) => {
                return (
                  <Link className="LinkAppearance" to={"/" + key}>
                    {key}
                  </Link>
                );
              })}
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
