import React, { Component } from 'react';
import Attachment from '../Attachment';
import { uid } from 'react-uid';
import { rand_string } from '../../lib/util';
import ImageUploader from '../ImageUploader';

class AddContent extends Component {
  state = {
    image_url: '',
  };

  // handle the input link
  handleInputLink = event => {
    this.setState({ input_link: event.target.value });
  };

  // send the input link to the NewPost component
  sendLinkBack = event => {
    const { addedAttachmentLink, secondary_key, parent_key } = this.props;
    const type = event.target.id === 'youtube' ? 'youtube' : 'image_link';
    addedAttachmentLink(this.state.input_link, type, parent_key, secondary_key);
  };

  // send the input text to the NewPost component
  sendTextBack = event => {
    const { addedAttachmentWords, parent_key, secondary_key } = this.props;
    this.setState({ text: event.target.value });
    addedAttachmentWords(event.target.value, 'text', parent_key, secondary_key);
  };

  //set the state of the uploaded image/file url.
  setFileState = (key, value, file_type) => {
    const type_of_file = file_type.includes('pdf') ? 'pdf' : 'image';
    const url_type = file_type.includes('pdf') ? 'pdf_url' : 'image_url';
    this.setState({ [url_type]: value });
    const url = file_type.includes('pdf') ? this.state.pdf_url : this.state.image_url;
    this.props.addedAttachmentFile(type_of_file, url, this.props.secondary_key);
  };

  // generate and return the required attachment
  getContentInput = () => {
    const { title, deleteItem, secondary_key } = this.props;
    if (this.props.type === 'text') {
      return (
        <div>
          <div className="form-group">
            <h4 htmlFor="content">Text</h4>
            <textarea
              className="form-control"
              rows="5"
              id="content"
              placeholder="What's in your mind right now?"
              onChange={this.sendTextBack}
              defaultValue={this.props.title}
            />
          </div>
          <div className="delete-button">
            <button
              className="btn btn-danger"
              type="button"
              id="DeleteButton"
              onClick={deleteItem.bind(this, secondary_key)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    } else if (this.props.type === 'youtube') {
      return (
        <div className="form-group">
          <h4>YouTube Link</h4>
          <input
            type="text"
            className="form-control"
            id="youtube-link"
            onChange={this.handleInputLink}
          />
          <button
            type="submit"
            className="btn btn-primary btn-lg float-right input-link-button"
            id="youtube"
            onClick={this.sendLinkBack}
          >
            Confirm
          </button>
        </div>
      );
    } else if (this.props.type === 'file') {
      return (
        <div className="upload-btn-wrapper">
          <ImageUploader setParentState={this.setFileState} public_id={''} />
        </div>
      );
    } else if (this.props.type === 'image_link') {
      return (
        <div className="form-group">
          <h4>Image Link</h4>
          <input type="text" className="form-control" onChange={this.handleInputLink} />
          <button
            type="submit"
            className="btn btn-primary btn-lg float-right input-link-button"
            id="image-link"
            onClick={this.sendLinkBack}
          >
            Confirm
          </button>
        </div>
      );
    } else if (this.props.type === 'pdf') {
      return (
        <div className="upload-btn-wrapper">
          <ImageUploader setParentState={this.setFileState} public_id={''} />
        </div>
      );
    } else if (this.props.type === 'pdf_attach') {
      return (
        <div>
          <Attachment key={uid(rand_string())} type={'pdf'} content={title} />
          <div className="delete-button">
            <button
              className="btn btn-danger"
              type="button"
              id="DeleteButton"
              onClick={deleteItem.bind(this, secondary_key)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    } else if (this.props.type === 'image_attach') {
      return (
        <div>
          <Attachment key={uid(rand_string())} type={'image'} content={title} />
          <div className="delete-button">
            <button
              className="btn btn-danger"
              type="button"
              id="DeleteButton"
              onClick={deleteItem.bind(this, secondary_key)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    } else if (this.props.type === 'youtube_attach') {
      return (
        <div>
          <Attachment key={uid(rand_string())} type={'youtube'} content={title} />
          <div className="delete-button">
            <button
              className="btn btn-danger"
              type="button"
              id="DeleteButton"
              onClick={deleteItem.bind(this, secondary_key)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    } else if (this.props.type === 'image_link_attach') {
      return (
        <div>
          <Attachment key={uid(rand_string())} type={'image_link'} content={title} />
          <div className="delete-button">
            <button
              className="btn btn-danger"
              type="button"
              id="DeleteButton"
              onClick={deleteItem.bind(this, secondary_key)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    }
  };

  render() {
    const { addInput, secondary_key } = this.props;
    return (
      <div className="add-content-component">
        <div className="content-input">{this.getContentInput()}</div>
        <div className="add-button">
          <div className="dropdown">
            <button
              className="btn btn-outline-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Add
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button
                className="dropdown-item"
                href="new_post2"
                value="text"
                onClick={addInput.bind(this, 'text', secondary_key)}
              >
                Text
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="youtube"
                onClick={addInput.bind(this, 'youtube', secondary_key)}
              >
                YouTube Link
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="image"
                onClick={addInput.bind(this, 'file', secondary_key)}
              >
                Image/PDF
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="image_link"
                onClick={addInput.bind(this, 'image_link', secondary_key)}
              >
                Image Link
              </button>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default AddContent;
