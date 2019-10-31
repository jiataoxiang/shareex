import React, {Component} from "react";
import "../../stylesheets/new_post.scss";
// import ReactSummernote from 'react-summernote';
// import 'react-summernote/dist/react-summernote.css'; // import styles
// import 'react-summernote/lang/summernote-ru-RU'; // you can import any other locale

// Import bootstrap(v3 or v4) dependencies
// import 'bootstrap/js/modal';
// import 'bootstrap/js/dropdown';
// import 'bootstrap/js/tooltip';
// import 'bootstrap/dist/css/bootstrap.css';

class PostContent extends Component {
  state = {};

  componentDidMount() {
  }

  onChange(content) {
    console.log('onChange', content);
  }

  render() {
    return (
      <div className="new-post-page">
        {/*<Helmet>*/}
        {/*  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"/>*/}
        {/*  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css"/>*/}
        {/*  <script type="text/javascript"*/}
        {/*          src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js"/>*/}
        {/*  <link href="summernote.css" rel="stylesheet"/>*/}
        {/*  <script src="summernote.js"/>*/}
        {/*</Helmet>*/}
        <div className="container">
          <div className="article">
            <h1 id="title">Start a New Post</h1>

            <div className="form-group">
              <p>Title:</p>
              <input type="text" className="form-control" id="tile"/>
            </div>
            <div className="form-group">
              <p htmlFor="content">Content:</p>
              <textarea
                className="form-control"
                rows="5"
                id="content"
                placeholder="What's in your mind right now?"
              />
            </div>
          </div>
          <div className="addInfo">
            <div className="form-group">
              <p>Category:</p>
              <select className="form-control" id="category">
                <option>Travel</option>
                <option>Meme</option>
                <option>Question</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="form-group">
              <p>File Type:</p>
              <select className="form-control" id="file_type">
                <option>PDF</option>
                <option>JPEG</option>
                <option>PNG</option>
                <option>DOCS</option>
              </select>
            </div>
            <input
              type="file"
              className="form-control-file border"
              id={"file"}
            />
          </div>
          <button type="submit" className="btn btn-success btn-md btn-block" id="post-button">
            Post
          </button>
          {/*<script>*/}
          {/*  {$(document).ready(function() {$('#summernote').summernote();})}*/}
          {/*</script>*/}
          {/*<ReactSummernote*/}
          {/*  value="Default value"*/}
          {/*  options={{*/}
          {/*    lang: 'ru-RU',*/}
          {/*    height: 350,*/}
          {/*    dialogsInBody: true,*/}
          {/*    toolbar: [*/}
          {/*      ['style', ['style']],*/}
          {/*      ['font', ['bold', 'underline', 'clear']],*/}
          {/*      ['fontname', ['fontname']],*/}
          {/*      ['para', ['ul', 'ol', 'paragraph']],*/}
          {/*      ['table', ['table']],*/}
          {/*      ['insert', ['link', 'picture', 'video']],*/}
          {/*      ['view', ['fullscreen', 'codeview']]*/}
          {/*    ]*/}
          {/*  }}*/}
          {/*  onChange={this.onChange}*/}
          {/*/>*/}
        </div>
      </div>
    );
  }
}

export default PostContent;
