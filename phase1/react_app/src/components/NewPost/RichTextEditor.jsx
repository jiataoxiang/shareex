import React, { Component } from "react";
import "../../stylesheets/rich_text_editor.scss";

class RichTextEditor extends Component {
    state = {
    
    };
    
    textBold = () => { document.execCommand('bold', false, null); }
    textItalic = () => { document.execCommand('italic', false, null); }
    textUnderline = () => { document.execCommand('underline', false, null); }
    textStrikeThrough = () => { document.execCommand('strikeThrough', false, null); }
    
    textColor = (event) => { document.execCommand('forecolor', false, event.target.value); }
    
    insertLink = () => {
        let inputUrl = window.prompt('Please input your url');
        if (inputUrl) document.execCommand('createLink', false, inputUrl);
    }
    
    insertLatex = () => {
        // might be hard to implement
    }
    
    insertCode = () => {
    }
    
    insertImgPre = () => { document.getElementById("insert-image").click(); }
    insertImg = (event) => {
        const inputFile = event.target.files[0]
        
        if (inputFile != null) {
            const isJPG = inputFile.type === 'image/jpeg';
            const isPNG = inputFile.type === 'image/png';

            if (!isJPG && !isPNG) {
                inputFile.status = 'error';
                console.log("You can only upload png or jpg files.");
            } else {
                const imgReader = new FileReader();
                imgReader.addEventListener('load', () => {
                    const imgURL = imgReader.result;
                    document.execCommand('insertHtml', false, `<img src=${imgURL} style='width:200px;'>`);
                })
                imgReader.readAsDataURL(inputFile);
            }
        }
    }
    
    insertPDFPre = () => { document.getElementById("insert-PDF").click(); }
    insertPDF = (event) => {
        const inputFile = event.target.files[0]
        
        if (inputFile != null) {
            const isPDF = inputFile.type === 'application/pdf';

            if (!isPDF) {
                inputFile.status = 'error';
                console.log("You can only upload pdf files.");
            } else {
                const imgReader = new FileReader();
                imgReader.addEventListener('load', () => {
                    const imgURL = imgReader.result;
                    document.execCommand('insertHtml', false, `<img src=${imgURL} style='width:200px;'>`);
                })
                imgReader.readAsDataURL(inputFile);
            }
        }
    }

    render() {
        return (
            <div className="container rich-text-editor">
                <div className="nav-buttons">
                    <img className="format-button" 
                        src="./icon/TEbotton_bold.png" 
                        alt="" 
                        type="button" 
                        onClick={this.textBold}/>
                    <img className="format-button" 
                        src="./icon/TEbotton_italic.png" 
                        alt="" 
                        type="button" 
                        onClick={this.textItalic}/>
                    <img className="format-button" 
                        src="./icon/TEbotton_undeline.png" 
                        alt="" 
                        type="button" 
                        onClick={this.textUnderline}/>
                    <img className="format-button" 
                        src="./icon/TEbotton_strikeThrough.png" 
                        alt="" 
                        type="button" 
                        onClick={this.textStrikeThrough}/>
                    <input className="format-color" type='color' onChange={this.textColor}/>
                    
                    <div className="dropdown">
                        <button className="dropdown-toggle" 
                            type="button" 
                            id="dropdownMenuButton" 
                            data-toggle="dropdown">
                            Insert
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button className="dropdown-item" 
                                onClick={this.insertLink}>
                                Link
                            </button>
                            <button className="dropdown-item" 
                                onClick={this.insertLatex}>
                                Latex
                            </button>
                            <button className="dropdown-item" 
                                onClick={this.insertCode}>
                                Code
                            </button>
                            
                            <button className="dropdown-item" 
                                onClick={this.insertImgPre}>
                                Image
                            </button>
                            <input type="file" 
                                id="insert-image" 
                                hidden="hidden" 
                                onChange={this.insertImg}/>
                            
                            <button className="dropdown-item" 
                                onClick={this.insertPDFPre}>
                                PDF
                            </button>
                            <input type="file" 
                                id="insert-PDF" 
                                hidden="hidden" 
                                onChange={this.insertPDF}/>
                        </div>
                    </div>
                </div>
                <div className="content"
                     contentEditable="true"></div>
            </div>
        );
    }
}

export default RichTextEditor;
