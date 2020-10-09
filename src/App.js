import React from "react";

import "./App.css";

const BACKEND_URL = "http://localhost:5000";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileUpload: null,
      languageSelect: "english",
      threadID: null,
      status: "",
      progress: "",
      summarizedText: "",
    };

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleSubmitForm(event) {
    event.preventDefault();

    const data = new FormData();
    data.append("pdfFile", this.state.fileUpload);
    data.append("language", "spanish");

    fetch(`${BACKEND_URL}/pdfsummarizer/api/post/submitpdf`, {
      method: "POST",
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          threadID: data["Thread ID"],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleOnChange(event) {
    event.preventDefault();

    switch (event.target.name) {
      case "fileUpload":
        this.setState({
          fileUpload: event.target.files[0],
        });
        return;
      default:
        console.log("default case");
        return;
    }
  }

  handleCheckStatus() {
    console.log(this.state.threadID);

    const request = {
      "Thread ID": this.state.threadID,
    };

    fetch(`${BACKEND_URL}/pdfsummarizer/api/post/checkstatus`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          status: data["Status"],
          progress: data["Progress"],
          summarizedText: data["Summarized Text"],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className="App">
        <h1>PDF Summarizer</h1>
        <p>Upload a PDF file you'd like to summarize. </p>

        <form onSubmit={this.handleSubmitForm}>
          <div>
            <label htmlFor="fileUpload">Choose PDF file</label>
            <input
              name="fileUpload"
              type="file"
              accept="application/pdf"
              onChange={this.handleOnChange}
              required
            ></input>
          </div>
          <div>
            <label htmlFor="languageSelect">Choose language</label>
            <select name="languageSelect" required>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>
          <input type="submit" value="Upload File"></input>
        </form>

        {this.state.threadID && (
          <div className="result-container">
            <p>Progress: {this.state.progress}</p>
            <button
              onClick={() => {
                this.handleCheckStatus();
              }}
            >
              Check Status
            </button>
            {this.state.progress === "Complete" ? (
              <>
                <h2>Summarized Text</h2>
                <p className="summarized-text">{this.state.summarizedText}</p>
              </>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default App;
