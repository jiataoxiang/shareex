import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class AdminProfileFindPost extends React.Component {
    state = {
        avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png", 
        username: "",
        id: "",
        author: "",
        title: "",
        category: "",
        deleted: false, 
        delete_date: null, 
        
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
    
    showPost = () => {
        this.tempElements.display_post.removeAttribute("hidden");
        if (this.state.deleted) {
            this.tempElements.display_delete.removeAttribute("hidden");
            this.tempElements.button_delete.innerHTML = "Recover";
        } else {
            this.tempElements.display_delete.setAttribute("hidden", true);
            this.tempElements.button_delete.innerHTML = "Delete";
        }
    }
    
    hidePost = () => {
        this.tempElements.display_post.setAttribute("hidden", true);
    }
    
    getPostInfo = () => {
        if (this.state.inputid.length === 0) {
            alert("Must input a id.")
        } else {
            axios.get(
                `/api/posts/${this.state.inputid}`, this.tokenConfig()
            ).then(post => {
                if (!post) {
                    this.hidePost();
                    alert("This post does not exist.");
                } else {
                    const curPost = post.data;
                    this.setState({
                        id: curPost._id,
                        author: curPost.author,
                        title: curPost.title,
                        category: curPost.category,
                        deleted: curPost.hidden, 
                        delete_date: Date.parse(curPost.delete_date)
                    });
                    this.getAuthorInfo();
                }
            }).catch(error => {
                this.hidePost();
                alert("Failed to get post.");
                console.log(error);
            })
        }
    }
    
    getAuthorInfo = () => {
        axios.get(
            `/api/users/${this.state.author}`, this.tokenConfig()
        ).then(user => {
            if (!user) {
                this.hidePost();
                alert("The author of this post no longer exists.");
            } else {
                const curUser = user.data;
                this.setState({
                    avatar: curUser.avatar,
                    username: curUser.username,
                });
                    this.showPost();
                }
            }).catch(error => {
                this.hidePost();
                alert("Failed to get user.");
                console.log(error);
            })
    }
    
    saveChange = () => {
        
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
    
    tokenConfig = () => {
        // Get token from localstorage
        const token = this.props.auth.token;

        // Headers
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };

        // If token, add to headers
        if (token) {
            config.headers['x-auth-token'] = token;
        } else {
            window.location.href = '/';
        }

        return config;
    };
    
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
                    <div className="row row-info">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="avatar-container">
                              <img id="user-avatar" src={this.state.avatar} alt="" />
                              <h6>{this.state.username}</h6>
                            </div>
                            <div id="text-block" className="col-md-8">
                              <p>Title:  {this.state.title}</p>
                              <p>Category:  {this.state.category}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                            <button type="button"
                                id="button-change" 
                                className="btn"
                                onClick={this.saveChange}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                    
                    <div className="row row-delete">
                        <div className="col-md-8">
                             <div id="delete-warning">
                                <h6>Deleted {
                                        Math.ceil((Date.now() - this.state.delete_date) 
                                        / (1000*60*60*24))               
                                    } days ago.</h6>
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

// getting from reducers (error and auth reducers)
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  auth: state.auth
});

export default connect(mapStateToProps)(AdminProfileFindPost);
