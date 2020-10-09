import React from "react";

const BACKEND_URL = "http://localhost:5000";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: null,
    };

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleSubmitForm(event) {
    event.preventDefault();

    const data = new FormData();
    data.append("pdfFile", this.state.uploadedFile);
    data.append("language", "spanish");

    fetch(`${BACKEND_URL}/api/post/submitpdf`, {
      method: "POST",
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleOnChange(event) {
    event.preventDefault();

    this.setState({
      uploadedFile: event.target.files[0],
    });
  }

  render() {
    return (
      <div className="App">
        <h1>PDF Summarizer</h1>
        <p>Upload a PDF file you'd like to summarize. </p>

        <form onSubmit={this.handleSubmitForm}>
          <label htmlFor="fileUpload">Choose PDF file</label>
          <input
            id=""
            name="fileUpload"
            type="file"
            accept="application/pdf"
            onChange={this.handleOnChange}
            required
          ></input>
          <input type="submit" value="Upload File"></input>
        </form>
      </div>
    );
  }
}

export default App;
