import React, { Component } from 'react';
import axios from 'axios';

class SingleImageUpload extends Component {
  state = {
    filename: '',
    progress: 0,
    url: '',
    file_type: '',
    msg: '',
    public_id: '',
    isUploading: false
  };

  removeFile = () => {
    if (this.state.public_id) {
      axios
        .delete(`/upload/${this.state.public_id}`)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  onChange = async e => {
    // this.removeFile();
    if (!e.target.files[0]) return;
    this.setState({
      filename: e.target.files[0].name,
      file_type: e.target.files[0].type
    });
    console.log(e.target.files);
    const input_element = document.getElementById('file-input');
    if (!input_element.files || !input_element.files[0]) {
      this.setMessage('No file chosen');
      return;
    }
    const file = input_element.files[0];
    const file_type = file.type;
    this.setState({ isUploading: true });
    if (
      !file_type.includes('png') &&
      !file_type.includes('jpg') &&
      !file_type.includes('pdf')
    ) {
      this.setMessage('File must be jpg, png or pdf file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file); // get first file chosen
    formData.append('public_id', 'huakunshentimetable');
    const setUploadPercentage = this.setUploadPercentage;
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      this.setMessage('File Uploaded');
      console.log(res.data[0]);
      this.setState({ url: res.data[0].url, public_id: res.data[0].public_id });
      this.setState({ isUploading: false });
    } catch (err) {
      if (err.response.status === 500) {
        this.setMessage('There was a problem with the server');
      } else {
        this.setMessage(err.response.data.msg);
      }
      console.log(err);
    }
  };

  setUploadPercentage = progress => {
    this.setState({ progress });
  };

  onSubmit = async e => {
    e.preventDefault();
  };

  getDisplay = () => {
    if (this.state.isUploading) {
      return <h3>Uploading</h3>;
    }
    if (this.state.url) {
      if (this.state.file_type.includes('pdf')) {
        console.log('is a pdf');
        return (
          <embed
            className="center"
            src={this.state.url}
            width="100%"
            height="1000px"
          />
        );
      } else {
        return (
          <img
            src={this.state.url}
            className="rounded mx-auto d-block"
            alt="..."
            style={{ width: '50%' }}
          />
        );
      }
    } else {
      return null;
    }
  };

  setMessage = msg => {
    this.setState({ msg });
    setTimeout(() => {
      this.setState({ msg: '' });
    }, 2000);
  };

  render() {
    // const buttonCSS = { padding: 0, border: 'none', background: 'none' };
    return (
      <div className="container mt-5">
        {this.state.msg ? (
          <div className="alert alert-info" role="alert">
            {this.state.msg}
          </div>
        ) : null}
        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="file-input"
              onChange={this.onChange}
            />
            <label className="custom-file-label" htmlFor="inputGroupFile02">
              {this.state.filename ? this.state.filename : 'Choose file'}
            </label>
          </div>
          {/* <button
            style={buttonCSS}
            className="input-group-append"
            onClick={this.onSubmit}
          >
            <span className="input-group-text" id="">
              Upload
            </span>
          </button> */}
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${this.state.progress}%` }}
            aria-valuenow={this.state.progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {this.state.progress}%
          </div>
        </div>
        <br />
        {this.getDisplay()}
      </div>
    );
  }
}

export default SingleImageUpload;
