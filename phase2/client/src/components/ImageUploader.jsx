import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../stylesheets/image_uploader.scss';
import { toHttps } from '../lib/util';

class ImageUploader extends Component {
  state = {
    filename: '',
    progress: 0,
    url: '',
    file_type: '',
    msg: '',
    public_id: '',
    isUploading: false,
  };

  // remove file from cloudinary database
  removeFile = () => {
    if (this.state.public_id) {
      axios
        .delete(`/upload/${this.state.public_id}`)
        .then()
        .catch(err => {
          console.log(err);
        });
    }
  };

  // onchange function
  onChange = async e => {
    if (!this.props.public_id) {
      this.removeFile();
    }
    if (!e.target.files[0]) return;
    this.setState({
      filename: e.target.files[0].name,
      file_type: e.target.files[0].type,
    });
    const input_element = e.target;
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
      !file_type.includes('jpeg') &&
      !file_type.includes('pdf')
    ) {
      this.setMessage('File must be jpg, jpeg, png or pdf file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file); // get first file chosen
    if (this.props.public_id) {
      formData.append('public_id', this.props.public_id);
    }
    const setUploadPercentage = this.setUploadPercentage;
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)),
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        },
      });

      this.setMessage('File Uploaded');
      const url = toHttps(res.data[0].url);
      this.setState({ url: url, public_id: res.data[0].public_id });
      this.props.setParentState('file_url', this.state.url, file_type);
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

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  // set up upload bar
  setUploadPercentage = progress => {
    this.setState({ progress });
  };

  onSubmit = async e => {
    e.preventDefault();
  };

  // show the added file
  getDisplay = () => {
    if (this.state.isUploading) {
      return <h3>Uploading</h3>;
    }
    if (this.state.url) {
      if (this.state.file_type.includes('pdf')) {
        const url = toHttps(this.state.url);
        return <embed className="center" src={url} width="100%" height="1000px" />;
      } else {
        return (
          <React.Fragment>
            <br />
            <img
              src={this.state.url}
              className="rounded mx-auto d-block"
              alt="..."
              style={{ width: '100%' }}
            />
          </React.Fragment>
        );
      }
    } else {
      return null;
    }
  };

  // set message
  setMessage = msg => {
    this.setState({ msg });
    setTimeout(() => {
      this.setState({ msg: '' });
    }, 5000);
  };

  render() {
    return (
      <div className="image-uploader-component">
        <h2>Upload your Image/PDF</h2>
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
        </div>
        <div className="progress mb-2">
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
        {this.getDisplay()}
      </div>
    );
  }
}

export default withRouter(ImageUploader);
