import React from 'react';

class AdminProfileFindPost extends React.Component {
    state = {
        title: "",
        author: "",
        category: "",
        numlikes: -1,
        numcomments: -1,
        
        inputid: ""
    };

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }
    
    render() {
        return (
            <div id="findpost">
                <div id="search-post">
                    <p>Find post by id:</p>
                    <input
                        type="text"
                        id="post-id-input" 
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        name="inputid" 
                        value={this.state.inputid} 
                        onChange={this.handleInputChange}
                    />
                    <button type="button" 
                        className="btn">Find</button>
                </div>
                
                
                <div id="display-post">
                    <div id="text-block">
                        <h5>Title:  {this.state.title}</h5>
                        <span className="post-info">Author:  {this.state.author}</span>
                        <span className="post-info">Category:  {this.state.category}</span>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-8">
                             <div id="delete-warning">
                                <h6>Deleted on {this.state.username}</h6>
                             </div>
                        </div>
                        <div className="col-md-4">
                            <button type="button" 
                            className="btn">Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminProfileFindPost;