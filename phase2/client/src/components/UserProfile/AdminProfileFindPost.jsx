import React from 'react';

class AdminProfileFindPost extends React.Component {
    state = {
        title: "",
        author: "",
        category: "",
        numlikes: -1,
        numcomments: -1,
        deleted: false, 
        
        inputid: ""
    };
    tempElements = {
        display_post: null, 
        display_delete: null,
        button_delete: null
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }
    
    getPostInfo = () => {
        //
        
        if (true) {
            this.tempElements.display_post.removeAttribute("hidden");
            if (this.state.deleted) {
                this.tempElements.display_delete.removeAttribute("hidden");
                this.tempElements.button_delete.innerHTML = "Recover";
            } else {
                this.tempElements.display_delete.setAttribute("hidden", true);
                this.tempElements.button_delete.innerHTML = "Delete";
            }
        } else {
            this.tempElements.display_post.setAttribute("hidden", true);
            alert("The post does not exist.");
        }
    }
    
    changeDelete = () => {
        if (this.state.deleted) {
            //
            
            this.setState({ deleted: false });
            this.tempElements.display_delete.setAttribute("hidden", true);
            this.tempElements.button_delete.innerHTML = "Delete";
        } else {
            //
            
            this.setState({ deleted: true });
            this.tempElements.display_delete.removeAttribute("hidden");
            this.tempElements.button_delete.innerHTML = "Recover";
        }
    }
    
    componentDidMount() {
        this.tempElements.display_post = document.getElementById("display-post");
        this.tempElements.display_post.setAttribute("hidden",true);
        
        this.tempElements.display_delete = document.getElementById("delete-warning");
        this.tempElements.display_delete.setAttribute("hidden",true);
        
        this.tempElements.button_delete = document.getElementById("button-delete");
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
                        className="btn"
                        onClick={this.getPostInfo}>
                        Find
                    </button>
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
                                id="button-delete" 
                                className="btn"
                                onClick={this.changeDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminProfileFindPost;